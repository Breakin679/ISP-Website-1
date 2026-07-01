
using Dapper;
using Dapper.Contrib.Extensions;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;

namespace ISP.DataAccess
{
    public class DapperRepository<T> : IRepository<T> where T : class
    {
        private readonly string _connectionString;

        public DapperRepository(IConfiguration configuration)
        {
            _connectionString = configuration
               .GetConnectionString("MyISP")
               ?? throw new InvalidOperationException("Missing MyISP");
        }

        private IDbConnection Connection() => new SqlConnection(_connectionString);

        public IEnumerable<T> GetAll()
        {
            using var db = Connection();
            db.Open();
            return db.GetAll<T>();
        }

        public T? GetById(int id)
        {
            using var db = Connection();
            db.Open();
            return db.Get<T>(id);
        }

        public long Insert(T entity)
        {
            using var db = Connection();
            db.Open();
            return db.Insert(entity);
        }

        public bool Update(T entity)
        {
            using var db = Connection();
            db.Open();
            return db.Update(entity);
        }

        public bool Delete(int id)
        {
            using var db = Connection();
            db.Open();

            // If T is Plan, forbid deletion while any active subscription references it
            if (typeof(T) == typeof(Plan))
            {
                const string sql = @"
SELECT COUNT(1)
  FROM Subscription
 WHERE plan_id = @Id
   AND (end_date IS NULL OR end_date > SYSUTCDATETIME());
";
                var activeCount = db.ExecuteScalar<int>(sql, new { Id = id });
                if (activeCount > 0)
                {
                    // there are still active subscriptions on this plan
                    return false;
                }
            }

            // now fall back to the normal delete
            var existing = db.Get<T>(id);
            if (existing == null)
                return false;

            return db.Delete(existing);
        }

    }
}
