
using System.Collections.Generic;

namespace ISP.DataAccess.Interfaces
{
    public interface IRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T? GetById(int id);
        long Insert(T entity);
        bool Update(T entity);
        bool Delete(int id);
        
    }
}
