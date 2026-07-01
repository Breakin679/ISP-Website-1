// Models/SubscriptionView.cs
public class SubscriptionView
{
    public int SubscriptionId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    // Plan fields
    public int PlanId { get; set; }
    public string PlanName { get; set; }
    public string PlanDesc { get; set; }
    public decimal PlanPrice { get; set; }

    // Server fields
    public int ServerId { get; set; }
    public string Location { get; set; }
}
