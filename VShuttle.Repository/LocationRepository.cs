using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VShuttle.Model;
using VShuttle.Repository.Interface;

namespace VShuttle.Repository
{
    public class LocationRepository : Repo<Locations>, ILocationRepository
    {       

    }
}
