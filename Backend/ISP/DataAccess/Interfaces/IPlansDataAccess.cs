// ISP/DataAccess/Interfaces/IPlansDataAccess.cs
using ISP.Models;
using System.Collections.Generic;

namespace ISP.DataAccess.Interfaces
{
    public interface IPlansDataAccess
    {
        IEnumerable<Plan> GetAvailablePlans();
        Plan? GetPlanById(int id);
        IEnumerable<Plan> GetPlansByType(int planTypeId);
    }
}
