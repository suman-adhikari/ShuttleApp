using System.Collections.Generic;
using VShuttle.Model;

namespace VShuttle.Repository.Interface
{
    public interface IRoutesRepository
    {
        List<Routes> FindAll();
        bool UpdateRoutes(int id, string routelocation);
    }
}