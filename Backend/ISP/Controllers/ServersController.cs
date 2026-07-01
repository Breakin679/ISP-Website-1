using Dapper;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Data;

public class ServerDTO
{
    public string Name { get; set; }

    public int Bandwidth { get; set; } = 0; // in Mbps
}

namespace ISP.Controllers


{ 
[ApiController]
[Route("servers")]


public class ServersController : ControllerBase
{
    private readonly IRepository<Server> _repo;
    private readonly string _conn;
    public ServersController(IRepository<Server> repo,IConfiguration cfg) { _repo = repo;
        _conn = cfg.GetConnectionString("MyISP")
                   ?? throw new InvalidOperationException("Missing MyISP connection string");
    }
        private IDbConnection Connection() => new SqlConnection(_conn);


        [HttpGet] public ActionResult<IEnumerable<Server    >> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<Server> Get(int id)
        => _repo.GetById(id) is Server s ? Ok(s) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(Server s)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(s) }, s);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, ServerDTO s)
    {
            var existing = _repo.GetById(id);
            if (existing == null) return NotFound();

            // Map only allowed fields
            existing.name = s.Name;
            existing.bandwidth = s.Bandwidth;





            return _repo.Update(existing) ? NoContent()
                                           : StatusCode(500, "Failed to update user.");
        }
        /// <summary>
        /// GET /servers/location/{loc}
        /// Returns all servers whose Location column equals the provided loc.
        /// </summary>
        // GET /servers/location/{location}
        [HttpGet("location/{location}")]
        public ActionResult<IEnumerable<Server>> GetServersByLocation(string location)
        {
            using var db = Connection();
            var sql = @"
SELECT 
    s.id,
    s.name,
    s.coverage_id,
    s.bandwidth,
    s.status
FROM Servers s
INNER JOIN Coverage c ON s.coverage_id = c.id
WHERE c.location = @Location";
            var servers = db.Query<Server>(sql, new { Location = location });
            return Ok(servers);
        }

        [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}


}
