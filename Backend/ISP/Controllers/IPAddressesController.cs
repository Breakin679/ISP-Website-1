using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("ipaddresses")]
public class IPAddressesController : ControllerBase
{
    private readonly IRepository<IPAddress> _repo;
    public IPAddressesController(IRepository<IPAddress> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<IPAddress>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<IPAddress> Get(int id)
        => _repo.GetById(id) is IPAddress ui ? Ok(ui) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(IPAddress ui)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(ui) }, ui);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, IPAddress ui)
    {
        if (_repo.GetById(id) is null) return NotFound();
        ui.id = id;
        return _repo.Update(ui) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
