using Dapper;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Numerics;
using System.Text.Json.Serialization;

namespace ISP.Controllers
{
    [ApiController]
    [Route("pendingrequests")]
    public class PendingRequestsController : ControllerBase
    {
        private readonly string _conn;
        public PendingRequestsController(IConfiguration cfg)
        {
            _conn = cfg.GetConnectionString("MyISP")
                ?? throw new InvalidOperationException("Missing MyISP connection string");
        }

        private IDbConnection Connection() => new SqlConnection(_conn);

        /// <summary>
        /// GET /pendingrequests/incomplete
        /// Returns all requests still marked Pending.
        /// </summary>

        [HttpGet("incomplete")]
        public ActionResult<IEnumerable<PendingRequestDto>> GetAllIncomplete()
        {
            using var db = Connection();
            var sql = @"
SELECT
  r.id,
  r.user_id                               AS UserId,
  /* build a full name, or fallback to email */
  COALESCE(u.fn + ' ' + u.ln, r.email)     AS RequesterName,
  r.email,
  r.phone_number                          AS PhoneNumber,
  r.location,
  r.plan_id                               AS PlanId,
  p.name                                  AS PlanName,
  p.public_ip_count                       AS PublicIpCount,
  r.requested_at                          AS RequestedAt,
  r.status,
  r.processed_at                          AS ProcessedAt
FROM dbo.Pending_Requests r
LEFT JOIN dbo.Users  u ON u.id = r.user_id
LEFT JOIN dbo.Plans  p ON p.id = r.plan_id
WHERE r.status = @Status
ORDER BY r.requested_at DESC;
";
            var list = db.Query<PendingRequestDto>(sql, new { Status = "Pending" });
            return Ok(list);
        }


        /// <summary>
        /// POST /pendingrequests
        /// Inserts a new row with status='Pending'.
        /// </summary>

        // PendingRequestsController.cs
        [HttpPost]
 public ActionResult<PendingRequest> Create([FromBody] AddPendingRequestDto dto)
        {

           
                        using var db = Connection();
                    var sql = @"
        INSERT INTO dbo.Pending_Requests
          (user_id, email, phone_number, location, plan_id, requested_at)
        VALUES
          (@UserId, @Email, @PhoneNumber, @Location, @PlanId, SYSUTCDATETIME());
        SELECT CAST(SCOPE_IDENTITY() AS BIGINT);
        ";
            var id = db.ExecuteScalar<long>(sql, dto);

                // Build the full PendingRequest to return
            var pr = new PendingRequest
            {
                Id = id,
                UserId = dto.UserId,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Location = dto.Location,
                PlanId = dto.PlanId,
                RequestedAt = DateTime.UtcNow,
                Status = "Pending",
                ProcessedAt = null
                };

            return CreatedAtAction(
              nameof(GetAllIncomplete),
              null,
              pr
            );
        }

        /// <summary>
        /// POST /pendingrequests/{id}/complete
        /// Marks the given request as Done.
        /// </summary>
        public class IpAddressInfo {
            
                public string IP { get; set; }        // property, not field
                public bool isPublic { get; set; }        // property
            

        }
        public class ApproveDto
        {
            public long ServerId { get; set; }

            [JsonPropertyName("ipAddresses")]
            public List<IpAddressInfo> IPs { get; set; } = new();
        }

        [HttpPost("{id:long}/approve")]
        public IActionResult Approve(long id, [FromBody] ApproveDto dto)
        {
            using var db = Connection();
            db.Open();
            using var tx = db.BeginTransaction();

            // 1) load pending
            var pending = db.QuerySingleOrDefault<PendingRequest>(
              "SELECT * FROM Pending_Requests WHERE id=@Id AND status='Pending';",
              new { Id = id }, tx);
            if (pending == null) return NotFound();

            // 2) reuse logic: create subscription
            var subId = db.ExecuteScalar<long>(
                @"INSERT INTO Subscription(plan_id, server_id, start_date)
          VALUES(@PlanId, @ServerId, SYSUTCDATETIME());
          SELECT CAST(SCOPE_IDENTITY() AS BIGINT);",
                new { PlanId = pending.PlanId, ServerId = dto.ServerId }, tx);

            if (pending.UserId != null)
            {
                db.Execute(
                  @"INSERT INTO SubscriptionUsers(subscription_id, user_id, is_primary, added_at)
            VALUES(@SubId, @UserId, 1, SYSUTCDATETIME());",
                  new { SubId = subId, UserId = pending.UserId }, tx);
            }

            // 3) manually insert IPs
            foreach (var ip in dto.IPs)
            {
                db.Execute(
                  @"INSERT INTO IPAddresses
             (ip_address, subscription_id, server_id, is_public, is_assigned, seen_at)
            VALUES(@Ip, @SubId, @Srv, @Pub, 1, SYSUTCDATETIME());",
                  new { Ip = ip.IP,Pub=ip.isPublic, SubId = subId, Srv = dto.ServerId },tx);
            }

            // 4) mark request as complete
            db.Execute(
              @"UPDATE Pending_Requests
         SET status='Done', processed_at=SYSUTCDATETIME()
         WHERE id = @Id;", new { Id = id }, tx);

            tx.Commit();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            using var db = Connection();
            var sql = "DELETE FROM dbo.Pending_Requests WHERE id = @Id;";
            var rowsAffected = db.Execute(sql, new { Id = id });

            if (rowsAffected == 0)
            {
                return NotFound();
            }
            else
            {
                return NoContent();
            }


        }
        public class PendingRequestDto
        {
            public long Id { get; set; }
            public long? UserId { get; set; }
            public string? RequesterName { get; set; }  // new
            public string? Email { get; set; }
            public string? PhoneNumber { get; set; }
            public string Location { get; set; }
            public long PlanId { get; set; }
            public string PlanName { get; set; }        // new
            public int PublicIpCount { get; set; }      // new
            public DateTime RequestedAt { get; set; }
            public string Status { get; set; }
            public DateTime? ProcessedAt { get; set; }
        }

    }
}

