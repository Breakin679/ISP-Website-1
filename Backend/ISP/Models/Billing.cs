using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations.Schema;


namespace ISP.Models
{
    [Dapper.Contrib.Extensions.Table("Billing")]
    public class Billing
    {
        [Key]
        public int id { get; set; }
        public string? bill_type { get; set; }

        [ForeignKey("User")]
        public int user_id { get; set; }

        [ForeignKey("Plan")]
        public int plan_id { get; set; }
        public string? description { get; set; }

        [ForeignKey("Operation")]
        public int operation_id { get; set; }
        public decimal total_costs { get; set; }
    }
}
