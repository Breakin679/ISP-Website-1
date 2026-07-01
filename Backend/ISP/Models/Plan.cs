using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Plans")]
    public class Plan
    {
        [Key]
        public int id { get; set; }
        public required string name { get; set; }
        public string? description_plan { get; set; }
        public int bandwidth { get; set; }
        public int data_limit { get; set; }
        public int plan_type_id { get; set; }
        public int limit_type { get; set; }
        public decimal price { get; set; }
        public int public_ip_count { get; set; }
    }
}
