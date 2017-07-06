using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VShuttle.Repository.Interface
{
    public interface IRepo<T> where T : class
    {
        bool Add(T entity);
        bool Update(T entity);

        T Get(int id);
        List<T> FindAll();

        bool Delete(int id);

        // just for test 
    }
}
