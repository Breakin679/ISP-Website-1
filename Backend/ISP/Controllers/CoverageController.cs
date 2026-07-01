using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Dapper;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("coverage")]
public class CoverageController : ControllerBase
{
    private readonly IRepository<Coverage> _repo;
    private readonly string _conn;
    public CoverageController(IRepository<Coverage> repo, IConfiguration cfg) { _repo = repo;
        _conn = cfg.GetConnectionString("MyISP")
                      ?? throw new InvalidOperationException("Missing MyISP connection string");
    }

    [HttpGet] public ActionResult<IEnumerable<Coverage>> GetAll() => Ok(_repo.GetAll().Where(x => x.Status == true));
    [HttpGet("locations")]
    public ActionResult GetAllLocations()
    {
        // 1️⃣ Fetch once
        var all = _repo.GetAll();

        // 2️⃣ Group & project to location strings
        var residential = all
            .Where(c => c.plan_type_id == 2)
            .Select(c => c.location)
            .Distinct()
            .ToList();

        var fiber = all
            .Where(c => c.plan_type_id == 1)
            .Select(c => c.location)
            .Distinct()
            .ToList();

        var corporate = all
            .Where(c => c.plan_type_id == 3)
            .Select(c => c.location)
            .Distinct()
            .ToList();

        // 3️⃣ Return a named JSON object
        return Ok(new
        {
            Residential = residential,
            Fiber = fiber,
            Corporate = corporate
        });
    }

    [HttpGet("{id:int}")]
    public ActionResult<Coverage> Get(int id)
        => _repo.GetById(id) is Coverage c ? Ok(c) : NotFound();
    [HttpGet("type/{planTypeId:int}")] public ActionResult<IEnumerable<Coverage>> GetByType(int planTypeId)
    {
        if (  planTypeId<1 || planTypeId>3) return BadRequest("type doesnt exist");
        var list = _repo
         .GetAll()
         .Where(c => c.plan_type_id == planTypeId)
         .ToList();
        return Ok(list); 
    }

    [HttpPost]
    public ActionResult<long> Create(Coverage cov)
    {
        cov.Status = true;
        CreatedAtAction(nameof(Get), new { id = _repo.Insert(cov) }, cov);
        return Ok();
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Coverage cov)
    {
        if (_repo.GetById(id) is null) return NotFound();
        cov.id = id;
        return _repo.Update(cov) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        using (var connection = new SqlConnection(_conn))
        {
            connection.Open();

            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    // Soft delete all servers under this coverage
                    var updateServers = @"UPDATE Servers SET status = 0 WHERE coverage_id = @CoverageId";
                    connection.Execute(updateServers, new { CoverageId = id }, transaction);

                    // Soft delete the coverage itself
                    var updateCoverage = @"UPDATE Coverage SET status = 0 WHERE id = @Id";
                    connection.Execute(updateCoverage, new { Id = id }, transaction);

                    transaction.Commit();
                    return NoContent();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, $"Error: {ex.Message}");
                }
            }
        }
    }

}
