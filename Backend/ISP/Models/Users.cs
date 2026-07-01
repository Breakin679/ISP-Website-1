
using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Users")]
    public class Users
    {
        [Key]
        public int id { get; set; }
        public required string email { get; set; }
        public required string password_hash { get; set; }
        public required string role { get; set; }
        public DateTime created_at { get; set; }
        public required string fn { get; set; }
        public required string ln { get; set; }
        public bool deleted { get; set; }

        public string? phone_number { get; set; }
        public int status { get; set; }
    }
}
