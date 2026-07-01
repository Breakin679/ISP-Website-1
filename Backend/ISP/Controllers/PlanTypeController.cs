using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("plan-types")]
public class PlanTypeController : ControllerBase
{
    private readonly IRepository<Plan_Type> _repo;
    public PlanTypeController(IRepository<Plan_Type> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<Plan_Type>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<Plan_Type> Get(int id)
        => _repo.GetById(id) is Plan_Type pt ? Ok(pt) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(Plan_Type pt)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(pt) }, pt);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Plan_Type pt)
    {
        if (_repo.GetById(id) is null) return NotFound();
        pt.id = id;
        return _repo.Update(pt) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
