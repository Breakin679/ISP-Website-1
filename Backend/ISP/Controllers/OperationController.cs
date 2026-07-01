using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("operations")]
public class OperationController : ControllerBase
{
    private readonly IRepository<Operation> _repo;
    public OperationController(IRepository<Operation> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<Operation>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<Operation> Get(int id)
        => _repo.GetById(id) is Operation op ? Ok(op) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(Operation op)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(op) }, op);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Operation op)
    {
        if (_repo.GetById(id) is null) return NotFound();
        op.id = id;
        return _repo.Update(op) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
