using System;
using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;    // ← make sure this is here
using ISP.DataAccess.Interfaces;
using ISP.Models;

namespace ISP.DataAccess
{
    public class PlansDataAccess : IPlansDataAccess
    {
        private readonly string _connectionString;

        // ← Inject IConfiguration (from Microsoft.Extensions.Configuration)
        public PlansDataAccess(IConfiguration configuration)
        {
            // This will read the "ConnectionStrings:CustomerConnection" value from appsettings.json
            _connectionString = configuration
                .GetConnectionString("MyISP")
                ?? throw new InvalidOperationException(
                    "Connection string 'CustomerConnection' not found in configuration."
                );
        }
        // ISP/DataAccess/PlansDataAccess.cs
        public Plan? GetPlanById(int id)
        {
            using var db = new SqlConnection(_connectionString);
            return db.QueryFirstOrDefault<Plan>("SELECT * FROM Plans WHERE id = @Id", new { Id = id });
        }

        public IEnumerable<Plan> GetPlansByType(int planTypeId)
        {
            using var db = new SqlConnection(_connectionString);
            return db.Query<Plan>("SELECT * FROM Plans WHERE plan_type_id = @TypeId", new { TypeId = planTypeId });
        }


        public IEnumerable<Plan> GetAvailablePlans()
        {
            using IDbConnection db = new SqlConnection(_connectionString);
            db.Open();

            // example query — tailor to your needs
            const string sql = "SELECT * FROM Plans ";
            return db.Query<Plan>(sql);
        }
    }
}
