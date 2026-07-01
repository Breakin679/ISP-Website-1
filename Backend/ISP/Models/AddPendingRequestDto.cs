// AddPendingRequestDto.cs
namespace ISP.Models
{
    public class AddPendingRequestDto
    {
        public long? UserId { get; set; }  // null for guests
        public string? Email { get; set; }  // optional if UserId set
        public string? PhoneNumber { get; set; }  // optional
        public string Location { get; set; }
        public long PlanId { get; set; }
    }
}
