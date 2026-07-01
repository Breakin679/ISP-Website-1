
using ISP.Models;
using System.Collections.Generic;

namespace ISP.Services.Interfaces
{
    public interface IPlansService
    {
        IEnumerable<Plan> GetAvailablePlans();
        Plan? GetPlanById(int id);
        IEnumerable<Plan> GetPlansByType(int planTypeId);
        // Later: Add business methods like ApplyPromotion, etc.
    }
}
