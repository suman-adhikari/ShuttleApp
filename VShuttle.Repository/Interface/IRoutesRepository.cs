using System.Collections.Generic;
using VShuttle.Model;

namespace VShuttle.Repository.Interface
{
    public interface IRoutesRepository : IRepo<Routes>
    {
        bool UpdateRoutes(int id, string routelocation);
    }
}