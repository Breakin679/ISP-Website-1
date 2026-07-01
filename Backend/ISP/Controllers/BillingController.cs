using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("billing")]
public class BillingController : ControllerBase
{
    private readonly IRepository<Billing> _repo;
    public BillingController(IRepository<Billing> repo) => _repo = repo;

    [HttpGet]
    public ActionResult<IEnumerable<Billing>> GetAll() => Ok(_repo.GetAll());

    [HttpGet("{id:int}")]
    public ActionResult<Billing> Get(int id)
    {
        var e = _repo.GetById(id);
        return e is null ? NotFound() : Ok(e);
    }

    [HttpPost]
    public ActionResult<long> Create(Billing billing)
    {
        var id = _repo.Insert(billing);
        return CreatedAtAction(nameof(Get), new { id }, billing);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Billing billing)
    {
        if (_repo.GetById(id) is null) return NotFound();
        billing.id = id;
        return _repo.Update(billing) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
