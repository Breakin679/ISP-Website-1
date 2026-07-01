using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using System;
using System.Data;
using System.Linq;
using Dapper;

namespace ISP.Controllers
{
    [ApiController]
    [Route("admin")]
    public class AdminController : ControllerBase
    {
        private readonly string _conn;

        public AdminController(IConfiguration config)
        {
            _conn = config.GetConnectionString("MyISP")
                ?? throw new InvalidOperationException("Missing MyISP connection string");
        }

        private IDbConnection Connection() => new SqlConnection(_conn);

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            using var db = Connection();

            var totalUsers = db.ExecuteScalar<int>("SELECT COUNT(*) FROM Users;");
            var activeSubs = db.ExecuteScalar<int>("SELECT COUNT(*) FROM Subscription WHERE end_date IS NULL;");
            var pendingRequests = db.ExecuteScalar<int>("SELECT COUNT(*) FROM Pending_Requests WHERE status = 'Pending';");
            var totalServers = db.ExecuteScalar<int>("SELECT COUNT(*) FROM Servers;");
            var totalPlans = db.ExecuteScalar<int>("SELECT COUNT(*) FROM Plans;");
            var totalBilling = db.ExecuteScalar<decimal>("SELECT SUM(total_costs) FROM Billing;");

            return Ok(new
            {
                totalUsers,
                activeSubscriptions = activeSubs,
                pendingRequests,
                totalServers,
                totalPlans,
                totalBilling
            });

        }
    }
}
