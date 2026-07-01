// ISP/Services/PlansService.cs
using ISP.DataAccess.Interfaces;
using ISP.Models;
using ISP.Services.Interfaces;
using System.Collections.Generic;

namespace ISP.Services
{
    public class PlansService : IPlansService
    {
        private readonly IPlansDataAccess _repo;

        public PlansService(IPlansDataAccess repo)
        {
            _repo = repo;
        }

        public IEnumerable<Plan> GetAvailablePlans()
        {
            // Direct pass‑through for now
            return _repo.GetAvailablePlans();
        }

        public Plan? GetPlanById(int id)
        {
            // Might add parameter validation or caching here
            return _repo.GetPlanById(id);
        }

        public IEnumerable<Plan> GetPlansByType(int planTypeId)
        {
            return _repo.GetPlansByType(planTypeId);
        }
    }
}
