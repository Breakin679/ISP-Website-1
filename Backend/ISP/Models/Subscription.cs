
using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Subscription")]
    public class Subscription
    {
        [Key]
        public int id { get; set; }
        
        public int plan_id { get; set; }
        public DateTime start_date { get; set; }
        public int consumption { get; set; }
        public int server_id { get; set; }

        public DateTime? end_date { get; set; }
    }
}
