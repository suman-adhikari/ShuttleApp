using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VShuttle.Model;

namespace VShuttle.Repository
{
    public class LocationRepository : Repo
    {

        public bool Add(Locations location)
        {
            db.Locations.Add(location);
            db.SaveChanges();
            return false;
        }

        public List<Locations> FindAll()
        {
            return db.Locations.ToList();
        }

        public Locations Get(int id)
        {
            return db.Locations.FirstOrDefault(Model => Model.Id == id);
        }

        public bool Delete(int id) {
            var location = db.Locations.FirstOrDefault(Models => Models.Id == id);
            db.Locations.Remove(location);
            db.SaveChanges();
            return true;
        }

        public bool Update(int id, string location)
        {
            var locations = db.Locations.FirstOrDefault(Models => Models.Id == id);
            locations.Location = location;
            db.SaveChanges();
            return true;
        }

        public List<Locations> FindAllLocation()
        {
            return db.Locations.ToList();
        }

    }
}
