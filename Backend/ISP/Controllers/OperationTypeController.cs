using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("operation-types")]
public class OperationTypeController : ControllerBase
{
    private readonly IRepository<Operation_Type> _repo;
    public OperationTypeController(IRepository<Operation_Type> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<Operation_Type>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<Operation_Type> Get(int id)
        => _repo.GetById(id) is Operation_Type ot ? Ok(ot) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(Operation_Type ot)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(ot) }, ot);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Operation_Type ot)
    {
        if (_repo.GetById(id) is null) return NotFound();
        ot.id = id;
        return _repo.Update(ot) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
