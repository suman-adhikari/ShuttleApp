using System.Collections.Generic;
using VShuttle.Model;

namespace VShuttle.Repository.Interface
{
    public interface ILocationRepository
    {
        bool Add(Locations location);
        bool Delete(int id);
        List<Locations> FindAll();
        List<Locations> FindAllLocation();
        Locations Get(int id);
        bool Update(int id, string location);
    }
}