using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Operation_Type")]
    public class Operation_Type
    {
        [Key]
        public int id { get; set; }
        public required string name { get; set; }
        public string? description { get; set; }
    }
}
