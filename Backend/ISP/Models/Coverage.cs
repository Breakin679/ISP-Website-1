using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace ISP.Models
{
    [Dapper.Contrib.Extensions.Table("Coverage")]
    public class Coverage
    {
        [Key]
        public int id { get; set; }
        public required string name { get; set; }

        [ForeignKey("PlanType")]
        public int plan_type_id { get; set; }
        public required string location { get; set; }
        public bool Status { get; set; }
    }
}
