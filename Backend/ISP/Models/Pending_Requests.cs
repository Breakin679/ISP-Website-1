using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Pending_Requests")]
    public class PendingRequest
    {
        [Key]
        public long Id { get; set; }
        public long? UserId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Location { get; set; }
        public long PlanId { get; set; }
        public DateTime RequestedAt { get; set; }
        public string Status { get; set; }   // "Pending" or "Done"
        public DateTime? ProcessedAt { get; set; }   // null until marked done
    }
}
