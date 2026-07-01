using Dapper;
using ISP.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

[ApiController]
[Route("subscriptions/{subId:long}/access")]
public class SubscriptionAccessController : ControllerBase
{
    private readonly IDbConnection _db;

    public SubscriptionAccessController(IConfiguration cfg)
    {
        _db = new SqlConnection(cfg.GetConnectionString("MyISP"));
    }

    // 1️⃣ User requests access
    // POST /subscriptions/{subId}/access
    [Authorize]  // must be logged in
    [HttpPost]
    public IActionResult RequestAccess(long subId, [FromBody] IDictionary<string, long> body)
    {
        if (!body.TryGetValue("userId", out var userId))
            return BadRequest("userId required");

        var sql = @"
INSERT INTO SubscriptionAccessRequests
  (subscription_id, user_id, status, requested_at)
VALUES
  (@SubId, @UserId, 'Pending', SYSUTCDATETIME());
";
        var rows = _db.Execute(sql, new { SubId = subId, UserId = userId });
        return rows > 0 ? Ok() : StatusCode(500);
    }

    // 2️⃣ Primary views pending requests
    // GET /subscriptions/{subId}/access
    [Authorize(Policy = "SubscriptionKeyValidated")]
    [HttpGet]
    public ActionResult<IEnumerable<AccessRequestDto>> GetPending(long subId)
    {
        var sql = @"
SELECT
  id             AS Id,
  subscription_id AS SubscriptionId,
  user_id        AS UserId,
  status,
  requested_at   AS RequestedAt,
  responded_at   AS RespondedAt
FROM SubscriptionAccessRequests
WHERE subscription_id = @SubId
  AND status = 'Pending'
ORDER BY requested_at DESC;
";
        var list = _db.Query<AccessRequestDto>(sql, new { SubId = subId });
        return Ok(list);
    }

    // 3️⃣ Primary approves/denies
    // POST /subscriptions/{subId}/access/{reqId}
    [Authorize(Policy = "SubscriptionKeyValidated")]
    [HttpPost("{reqId:long}")]
    public IActionResult Respond(long subId, long reqId, [FromBody] IDictionary<string, string> body)
    {
        if (!body.TryGetValue("decision", out var decision) ||
            (decision != "Approved" && decision != "Denied"))
            return BadRequest("decision must be 'Approved' or 'Denied'");

        using var tx = _db.BeginTransaction();

        // a) Update the request status
        var updateSql = @"
UPDATE SubscriptionAccessRequests
SET status = @Decision, responded_at = SYSUTCDATETIME()
WHERE id = @ReqId AND subscription_id = @SubId;
";
        var updated = _db.Execute(updateSql,
            new { Decision = decision, ReqId = reqId, SubId = subId },
            tx);
        if (updated == 0)
        {
            tx.Rollback();
            return NotFound();
        }

        // b) If approved, insert into SubscriptionUsers
        if (decision == "Approved")
        {
            // get the userId from the request row
            var userId = _db.QuerySingle<long>(
                @"SELECT user_id FROM SubscriptionAccessRequests
                  WHERE id = @ReqId;",
                new { ReqId = reqId },
                tx);

            // avoid duplicates
            var exists = _db.QuerySingle<int>(
                @"SELECT COUNT(1) FROM SubscriptionUsers
                  WHERE subscription_id = @SubId AND user_id = @UserId;",
                new { SubId = subId, UserId = userId },
                tx) > 0;

            if (!exists)
            {
                _db.Execute(@"
INSERT INTO SubscriptionUsers
  (subscription_id, user_id, is_primary, added_at)
VALUES
  (@SubId, @UserId, 0, SYSUTCDATETIME());
", new { SubId = subId, UserId = userId }, tx);
            }
        }

        tx.Commit();
        return NoContent();
    }
}

// DTO for requests
public class AccessRequestDto
{
    public long Id { get; set; }
    public long SubscriptionId { get; set; }
    public long UserId { get; set; }
    public string Status { get; set; }
    public DateTime RequestedAt { get; set; }
    public DateTime? RespondedAt { get; set; }
}
