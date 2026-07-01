﻿﻿﻿using Dapper;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using ISP.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.Security.Cryptography;

[ApiController]
[Route("subscriptions")]
public class SubscriptionController : ControllerBase
{
    private readonly IRepository<Subscription> _subRepo;
    private readonly IRepository<SubscriptionUser> _subUserRepo;
    private readonly IRepository<Plan> _planRepo;
    private readonly IRepository<Server> _serverRepo;
    private readonly IRepository<Coverage> _coverageRepo;
    private readonly ILogger<SubscriptionController> _logger;
    private readonly string _conn;

    public SubscriptionController(
        IRepository<Subscription> subRepo,
        IRepository<SubscriptionUser> subUserRepo,
        IRepository<Plan> planRepo,
        IRepository<Server> serverRepo,
        IRepository<Coverage> coverageRepo,
        ILogger<SubscriptionController> logger,
        IConfiguration config
    )
    {
        _subRepo = subRepo;
        _subUserRepo = subUserRepo;
        _planRepo = planRepo;
        _serverRepo = serverRepo;
        _coverageRepo = coverageRepo;
        _logger = logger;
        _conn = config.GetConnectionString("MyISP")
                    ?? throw new InvalidOperationException("Missing MyISP connection string");
    }

    private IDbConnection Connection() => new SqlConnection(_conn);
    // GET /subscriptions/active/{userId}
    [HttpGet("active/{userId:long}")]
    public ActionResult GetActive(long userId)
    {
        // 1) find all subscription-user links for this user
        var links = _subUserRepo.GetAll()
                       .Where(su => su.user_id == userId)
                        .Select(su => su.subscription_id);

        var subs = links.Select(id => _subRepo.GetById((int)id))
                        .Where(s => s != null && (s.end_date == null || s.end_date > DateTime.UtcNow))
                        .ToList();

        var views = subs.Select(s =>
        {
            var plan = _planRepo.GetById((int)s.plan_id);
            var srv = _serverRepo.GetById(s.server_id);
            var cov = _coverageRepo.GetAll().FirstOrDefault(c => c.id == srv.coverage_id);

            var location = cov.location ?? "Unknown";

            string keyHash;
            using (var conn = Connection())
            {
                keyHash = conn.Query<string>(
                    "SELECT access_key_hash FROM SubscriptionAccessRequests WHERE subscription_id = @SubId ORDER BY requested_at DESC",
                    new { SubId = s.id }
                ).FirstOrDefault();
            }

            return new
            {
                SubscriptionId = s.id,
                StartDate = s.start_date,
                EndDate = s.end_date,
                PlanId = plan?.id ?? 0,
                PlanName = plan?.name,
                PlanDesc = plan?.description_plan,
                PlanPrice = plan?.price ?? 0,
                ServerId = srv?.id ?? 0,
                PlanTypeId = plan?.plan_type_id?? 0,
                Location = location,
                SubscriptionKey = keyHash ?? string.Empty    // ← now included
            };
        }).ToList();

        if (!views.Any())
            return NotFound();

        return Ok(views);
    }
    [HttpPost("{id:long}/change-plan")]
    public IActionResult ChangePlan(long id, [FromBody] ChangePlanDto dto)
    {
        

        using var db = Connection();

        // if user_id is BIGINT in the DB, use long; use int if it's INT
        var userId = db.QuerySingleOrDefault<long?>(@"
    SELECT user_id
      FROM SubscriptionUsers
     WHERE subscription_id = @SubId
       AND is_primary = 1",
            new { SubId = id }
        );


        var currentPlan = db.QuerySingleOrDefault<Plan>(
    @"SELECT p.*
        FROM [Subscription] AS s
        INNER JOIN [Plans] AS p
           ON s.plan_id = p.id
       WHERE s.id = @SubId",
    new { SubId = id }
);


        if (currentPlan == null)
            return NotFound("Subscription not found");

        // Get new plan details
        var newPlan = db.QuerySingleOrDefault<Plan>(
            "SELECT * FROM Plans WHERE id = @PlanId",
            new { PlanId = dto.NewPlanId }
        );

        if (newPlan == null)
            return NotFound("New plan not found");

        // Check if new plan is same type as current plan
        if (newPlan.plan_type_id != currentPlan.plan_type_id)
            return BadRequest("New plan must be of the same plan type");

        // Get IP count for current subscription
        var currentIpCount = db.QuerySingleOrDefault<int>(
            "SELECT COUNT(1) FROM IPAddresses WHERE subscription_id = @SubId",
            new { SubId = id }
        );
        var location = db.QuerySingleOrDefault<string>(
    @"SELECT c.location
      FROM Subscription s
      JOIN Servers srv ON s.server_id = srv.id
      JOIN Coverage c ON srv.coverage_id = c.id
     WHERE s.id = @SubId",
    new { SubId = id }
);
        // Get IP count for new plan (assuming Plan has IpCount property or similar)
        var newPlanIpCount = newPlan.public_ip_count; // Adjust property name as per your model

        if (newPlanIpCount != currentIpCount)
        {
            // Insert into pending requests for IP change
            db.Execute(
                @"INSERT INTO Pending_Requests (location, plan_id, user_id, status, requested_at)
              VALUES (@Location, @PlanId, @UserId, 'PENDING', SYSUTCDATETIME())",
                new { Location= location,PlanId = dto.NewPlanId, UserId = userId }
            );

            return Ok(new { message = "IP count differs, pending request created" });
        }
        else
        {
            // Update subscription plan
            var rows = db.Execute(
                @"UPDATE Subscription SET plan_id = @PlanId WHERE id = @SubId",
                new { SubId = id, PlanId = dto.NewPlanId }
            );

            if (rows == 0)
                return NotFound("Subscription not found");

            // Update IPs automatically if needed (implement as per your logic)

            return Ok(new { subscriptionId = id, planId = dto.NewPlanId });
        }
    }



    [HttpGet]
    public ActionResult<IEnumerable<SubscriptionWithUsersDto>> GetAll()
    {
        using var db = Connection();
        var sql = @"
SELECT 
  s.id AS SubscriptionId,
  s.plan_id AS PlanId,
  s.server_id AS ServerId,
  s.start_date AS StartDate,
  u.id AS UserId,
  u.fn + ' ' + u.ln AS FullName
FROM Subscription s
LEFT JOIN SubscriptionUsers su ON su.subscription_id = s.id
LEFT JOIN Users u ON u.id = su.user_id
ORDER BY s.id;";

        var lookup = new Dictionary<long, SubscriptionWithUsersDto>();

        db.Query<SubscriptionWithUsersDto, UserDto, SubscriptionWithUsersDto>(
            sql,
            (sub, user) =>
            {
                if (!lookup.TryGetValue(sub.SubscriptionId, out var dto))
                {
                    dto = sub;
                    lookup.Add(sub.SubscriptionId, dto);
                }
                if (user?.UserId > 0)
                    dto.Users.Add(user);
                return dto;
            },
            splitOn: "UserId"
        );

        return Ok(lookup.Values);
    }

    [HttpGet("details")]
    public ActionResult<IEnumerable<SubscriptionWithUsersAndIpsDto>> GetDetails()
    {
        using var db = Connection();
        var sql = @"
SELECT
  s.id AS SubscriptionId,
  s.plan_id AS PlanId,
  s.server_id AS ServerId,
  u.id AS UserId,
  u.fn + ' ' + u.ln AS FullName,
  su.is_primary AS IsPrimary,
  ip.ip_address AS Ip
FROM Subscription s
LEFT JOIN SubscriptionUsers su ON su.subscription_id = s.id
LEFT JOIN Users u ON u.id = su.user_id
LEFT JOIN IPAddresses ip ON ip.subscription_id = s.id
ORDER BY s.id;";

        var lookup = new Dictionary<long, SubscriptionWithUsersAndIpsDto>();

        db.Query<SubscriptionWithUsersAndIpsDto, UserDto, IpDto, SubscriptionWithUsersAndIpsDto>(
            sql,
            (sub, user, ip) =>
            {
                if (!lookup.TryGetValue(sub.SubscriptionId, out var dto))
                {
                    dto = sub;
                    lookup.Add(sub.SubscriptionId, dto);
                }

                if (user != null && user.UserId > 0)
                {
                    // Add to users list
                    dto.Users.Add(user);
                    // Assign primary when flagged
                    if (user.IsPrimary)
                        dto.PrimaryUser = user;
                }

                if (ip != null && !string.IsNullOrWhiteSpace(ip.Ip))
                {
                    dto.Ips.Add(ip.Ip);
                }

                return dto;
            },
            splitOn: "UserId,Ip"
        );

        // Ensure a primary user is always set
        foreach (var dto in lookup.Values)
        {
            if (dto.PrimaryUser == null && dto.Users.Any())
                dto.PrimaryUser = dto.Users.First();
        }

        return Ok(lookup.Values);
    }

    [HttpPost("full")]
    public IActionResult CreateFull([FromBody] FullSubscriptionDto dto)
    {
        using var db = Connection();
        db.Open();
        using var tx = db.BeginTransaction();

        var subSql = @"
INSERT INTO Subscription (plan_id, server_id, start_date)
VALUES (@PlanId, @ServerId, SYSUTCDATETIME());
SELECT CAST(SCOPE_IDENTITY() AS BIGINT);";
        var newSubId = db.ExecuteScalar<long>(subSql, dto, tx);

        var linkSql = @"
INSERT INTO SubscriptionUsers
  (subscription_id, user_id, is_primary, added_at)
VALUES (@SubId, @UserId, @IsPrimary, SYSUTCDATETIME());";
        foreach (var u in dto.UserIds)
        {
            db.Execute(linkSql, new
            {
                SubId = newSubId,
                UserId = u,
                IsPrimary = u == dto.PrimaryUserId
            }, tx);
        }

        var ipSql = @"
INSERT INTO IPAddresses
  (subscription_id, ip_address, server_id, is_public, is_assigned, seen_at)
VALUES (@SubId, @Ip, @ServId, @IsPublic, 1, SYSUTCDATETIME());";
        foreach (var ip in dto.IpAddresses)
        {
            db.Execute(ipSql, new
            {
                SubId = newSubId,
                Ip = ip.Address,
                ServId = dto.ServerId,
                IsPublic = ip.IsPublic
            }, tx);
        }

        tx.Commit();
        return CreatedAtAction(nameof(GetDetails), new { }, null);
    }
    // DELETE /subscriptions/{id}
    [HttpDelete("{id:long}")]
    public IActionResult DeleteFull(long id)
    {
        using var db = Connection();
        db.Open();
        using var tx = db.BeginTransaction();

        // 1️⃣ Delete all IP assignments
        var ipRows = db.Execute(
            @"DELETE FROM IPAddresses
          WHERE subscription_id = @SubId;",
            new { SubId = id },
            tx
        );

        // 2️⃣ Delete all user links
        var linkRows = db.Execute(
            @"DELETE FROM SubscriptionUsers
          WHERE subscription_id = @SubId;",
            new { SubId = id },
            tx
        );
        // 2️⃣ Delete all user links
        var requestRows = db.Execute(
            @"DELETE FROM SubscriptionAccessRequests
          WHERE subscription_id = @SubId;",
            new { SubId = id },
            tx
        );

        // 3️⃣ Delete the subscription itself
        var subRows = db.Execute(
            @"
        UPDATE Subscription
           SET end_date = SYSUTCDATETIME()
         WHERE id = @SubId;
        ",
            new { SubId = id },
            tx
        );


        if (subRows == 0)
        {
            // nothing deleted => subscription not found
            tx.Rollback();
            return NotFound();
        }

        tx.Commit();
        return NoContent();
    }


    [HttpPut("full/{id:long}")]
    public IActionResult UpdateFull(long id, [FromBody] FullSubscriptionDto dto)
    {
        using var db = Connection();
        db.Open();
        using var tx = db.BeginTransaction();

        db.Execute(
            @"UPDATE Subscription
SET plan_id = @PlanId, server_id = @ServerId
WHERE id = @SubId;",
            new { SubId = id, dto.PlanId, dto.ServerId },
            tx
        );

        db.Execute(
            "DELETE FROM SubscriptionUsers WHERE subscription_id = @SubId;",
            new { SubId = id }, tx
        );
        var linkSql = @"
INSERT INTO SubscriptionUsers
  (subscription_id, user_id, is_primary, added_at)
VALUES (@SubId, @UserId, @IsPrimary, SYSUTCDATETIME());";
        foreach (var u in dto.UserIds)
        {
            db.Execute(linkSql, new
            {
                SubId = id,
                UserId = u,
                IsPrimary = u == dto.PrimaryUserId
            }, tx);
        }

        db.Execute(
            "DELETE FROM IPAddresses WHERE subscription_id = @SubId;",
            new { SubId = id }, tx
        );
        var ipSql = @"
INSERT INTO IPAddresses
  (subscription_id, server_id, ip_address, is_public, is_assigned, seen_at)
VALUES (@SubId, @ServId, @Ip, @IsPublic, 1, SYSUTCDATETIME());";
        foreach (var ip in dto.IpAddresses)
        {
            db.Execute(ipSql, new
            {
                SubId = id,
                ServId = dto.ServerId,
                Ip = ip.Address,
                IsPublic = ip.IsPublic
            }, tx);
        }

        tx.Commit();
        return NoContent();
    }
   
    
    [HttpPost("{id:long}/generate-key")]
    public ActionResult GenerateKey(long id)
    {
        // 1) create a cryptographically‐secure random key (e.g. 16 bytes => 32 hex chars)
        var keyBytes = new byte[16];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(keyBytes);
        var plainKey = BitConverter.ToString(keyBytes).Replace("-", "").ToLower(); // e.g. "9f2b4a..."

        // 2) hash it (reuse your existing SHA1 or better yet SHA256)
        var hash = Hashfunction.ComputeSha1(plainKey);

        // 3) store the hash in your table
        using var db = Connection();
        var rows = db.Execute(
            @"INSERT INTO SubscriptionAccessRequests
            (access_key_hash,subscription_id,requested_at)
         VALUES  (@Hash, @Id,SYSUTCDATETIME());",
            new { Id = id, Hash = hash }
        );

        if (rows == 0)
            return NotFound($"No subscription found with id {id}.");

        // 4) return the plain key to the caller
        return Ok(new { key = hash });
    }
    [HttpPost("validate-key")]
    public IActionResult ValidateAccessKey([FromBody] AccessDTO body)
    {
        if (string.IsNullOrEmpty(body.KeyHash) || body.UserId == 0)
            return BadRequest("Missing keyHash or userId.");

        using var db = Connection();
        var record = db.Query<(string Hash, DateTime RequestedAt, long SubscriptionId)>(
            @"SELECT access_key_hash, requested_at, subscription_id 
              FROM SubscriptionAccessRequests 
              WHERE access_key_hash = @key
              ORDER BY requested_at DESC",
            new { key = body.KeyHash }
        ).FirstOrDefault();

        if (record.Hash == null || !record.Hash.Equals(body.KeyHash, StringComparison.OrdinalIgnoreCase))
            return Unauthorized("Invalid key");

        // Time limit for key validity in minutes
        const int KeyTimeLimitMinutes = 60;

        // Check if key is within time limit
        if (DateTime.UtcNow > record.RequestedAt.AddMinutes(KeyTimeLimitMinutes))
            return Unauthorized("Key expired");

        // Prevent duplicate subscription-user link
        var exists = db.QuerySingleOrDefault<int>(
            @"SELECT COUNT(1) FROM SubscriptionUsers WHERE subscription_id = @SubId AND user_id = @UserId",
            new { SubId = record.SubscriptionId, UserId = body.UserId }
        );

        if (exists > 0)
            return Conflict("User already has access to this subscription.");

        var rows = db.Execute(
            @"INSERT INTO SubscriptionUsers (subscription_id, user_id, is_primary, added_at)
          VALUES (@SubId, @UserId, 0, SYSUTCDATETIME());",
            new { SubId = record.SubscriptionId, UserId = body.UserId }
        );

        if (rows == 0)
            return StatusCode(500, "Failed to grant access.");

        db.Execute("DELETE FROM SubscriptionAccessRequests WHERE subscription_id = @Id", new { Id = record.SubscriptionId });

        return Ok(new { granted = true });
    }

    public class FullSubscriptionDto
    {
        public long PlanId { get; set; }
        public long ServerId { get; set; }
        public long[] UserIds { get; set; }
        public long PrimaryUserId { get; set; }
        public IpAddressDto[] IpAddresses { get; set; }
    }

    public class IpAddressDto
    {
        public string Address { get; set; }
        public bool IsPublic { get; set; }
    }

    public class SubscriptionWithUsersDto
    {
        public long SubscriptionId { get; set; }
        public long PlanId { get; set; }
        public long ServerId { get; set; }
        public DateTime StartDate { get; set; }
        public List<UserDto> Users { get; set; } = new();
    }

    public class SubscriptionWithUsersAndIpsDto
    {
        public long SubscriptionId { get; set; }
        public long PlanId { get; set; }
        public long ServerId { get; set; }
        public UserDto PrimaryUser { get; set; }
        public List<UserDto> Users { get; set; } = new();
        public List<string> Ips { get; set; } = new();
    }

    public class UserDto
    {
        public long UserId { get; set; }
        public string FullName { get; set; }
        public bool IsPrimary { get; set; }
    }
    public class AccessDTO
    {
        public long UserId { get; set; }
        public string KeyHash { get; set; }
    }

    public class IpDto
    {
        public string Ip { get; set; }
    }
    public class AccessRequestDto
{
  public long Id { get; set; }
  public long SubscriptionId { get; set; }
  public long UserId { get; set; }
  public string Status { get; set; }
  public DateTime RequestedAt { get; set; }
  public DateTime? RespondedAt { get; set; }
}
    public class ChangePlanDto
    {
        public long NewPlanId { get; set; }
    }


}
