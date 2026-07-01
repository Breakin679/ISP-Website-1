using System;
using System.Collections.Generic;
using System.Linq;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using ISP.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;  
using Microsoft.Extensions.Configuration;

public class UpdateUserDto
{
    public string fn { get; set; }
    public string ln { get; set; }
    public string email { get; set; }
    public string phone_number { get; set; }
    public string role { get; set; }
    public string? password_hash { get; set; }   // Optional: only set if the user wants a new password
}


namespace ISP.Controllers
{
    [ApiController]
    [Route("users")]
    public class UsersController : ControllerBase
    {
        private readonly IRepository<Users> _repo;
        private readonly IConfiguration _configuration;

        public UsersController(IRepository<Users> repo, IConfiguration configuration)
        {
            _repo = repo;
            _configuration = configuration;
        }

        // GET /users
        [HttpGet]
        public ActionResult<IEnumerable<Users>> GetAll()
        {
            var all = _repo.GetAll().Where(x => x.deleted == false).ToList();
            // strip hashes
            all.ForEach(u => u.password_hash = null);
            return Ok(all);
        }

        // GET /users/{id}
        [HttpGet("{id:int}")]
        public ActionResult<Users> Get(int id)
        {
            var u = _repo.GetById(id);
            if (u == null) return NotFound();
            u.password_hash = null;
            return Ok(u);
        }

        // POST /users   (Sign‑Up)
        [HttpPost]
        public ActionResult<long> Create([FromBody] Signup nu)
        {
            if (nu == null ||
                string.IsNullOrWhiteSpace(nu.Email) ||
                string.IsNullOrWhiteSpace(nu.Password))
            {
                return BadRequest("Email and password required.");
            }

            // hash the password
            var hashed = Hashfunction.ComputeSha1(nu.Password.Trim());

            var u = new Users
            {
                fn = nu.FirstName,
                ln = nu.LastName,
                role = "Customer",
                email = nu.Email,
                password_hash = hashed,
                phone_number = nu.Phone,
                created_at = DateTime.UtcNow
            };

            var newId = _repo.Insert(u);
            u.id = (int)newId;
            u.password_hash = null;  // don't return hash

            return CreatedAtAction(nameof(Get), new { id = newId }, u);
        }

        // POST /users/login  (Login)
        [HttpPost("login")]
        public ActionResult<Users> Login([FromBody] Login creds)
        {
            if (creds == null ||
                string.IsNullOrWhiteSpace(creds.Email) ||
                string.IsNullOrWhiteSpace(creds.Password))
            {
                return BadRequest("Email and password required.");
            }

            // lookup user by email
            var user = _repo
                .GetAll()
                .FirstOrDefault(u => u.email == creds.Email && u.password_hash == Hashfunction.ComputeSha1(creds.Password));
            var jwtConfig = _configuration.GetSection("Jwt");
            var keyString = jwtConfig["Key"];
            if (string.IsNullOrEmpty(keyString))
            {
                // configuration is broken
                return StatusCode(500, "JWT Key is not configured.");
            }
            if (user == null)
                return Unauthorized("Invalid credentials.");
            var jwtSection = _configuration.GetSection("Jwt");
            var KeyBytes = Encoding.ASCII.GetBytes(jwtSection["Key"]!);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.email),
                    new Claim(ClaimTypes.Role, user.role),
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(KeyBytes),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);



            // verify password


            // success: strip hash and return
            user.password_hash = null;
            return Ok(new { token, user });
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdateUserDto updated)
        {
            var existing = _repo.GetById(id);
            if (existing == null) return NotFound();

            // Map only allowed fields
            existing.fn = updated.fn;
            existing.ln = updated.ln;
            existing.role = updated.role;
            existing.email = updated.email;
            existing.phone_number = updated.phone_number;

            

           

            return _repo.Update(existing) ? NoContent()
                                           : StatusCode(500, "Failed to update user.");
        }


        // DELETE /users/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            // 1. Fetch the existing user
            var user = _repo.GetById(id);
            if (user == null)
                return NotFound();

            // 2. Mark as deleted
            user.deleted = true;      // assuming `deleted` is an int (0/1)

            // 3. Persist update
            var success = _repo.Update(user);
            if (!success)
                return StatusCode(500, "Failed to mark user as deleted.");

            return NoContent();
        }
    }
}