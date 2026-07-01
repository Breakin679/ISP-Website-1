using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Plan_Type")]
    public class Plan_Type
    {
        [Key]
        public int id { get; set; }
        public required string name { get; set; }
        public string? description { get; set; }
    }
}
