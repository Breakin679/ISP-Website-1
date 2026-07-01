using Dapper.Contrib.Extensions;
namespace ISP.Models
{
    [Table("SubscriptionUsers")]
    public class SubscriptionUser
    {
        [Key]
        public long id { get; set; }
        
        public long subscription_id { get; set; }
        public long user_id { get; set; }
        public bool is_primary { get; set; }
        public DateTime added_at { get; set; }
    }
}