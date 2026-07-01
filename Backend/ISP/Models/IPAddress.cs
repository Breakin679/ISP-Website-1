
using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("IPAddresses")]
    public class IPAddress
    {
        [Key]
        public int id { get; set; }
        public int subscription_id { get; set; }
        public required string ip_address { get; set; }
        public DateTime seen_at { get; set; }
        public bool is_assigned { get; set; }
        public string? notes { get; set; }
        public bool ispublic { get; set; }
        
        public int server_id { get; set; }
    }
}
