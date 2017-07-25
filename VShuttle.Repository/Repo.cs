using System.Linq;
using VShuttle.Repository.Interface;
using System.Data;
using System.Data.Entity;
using System.Collections.Generic;

namespace VShuttle.Repository
{
    public abstract class Repo<T> : IRepo<T> where T : class
    {    
           
        public VShuttleContext db;
        public Repo()
        {
            db = new VShuttleContext();
        }     

        public virtual bool Add(T entity)
        {
            db.Set<T>().Add(entity);
            return Save();
        }

        public virtual bool Update(T entity)
        {
            db.Entry(entity).State = EntityState.Modified;
            return Save();
        }

        public virtual T Get(int id)
        {
            return db.Set<T>().Find(id);            
        }

        public virtual bool Delete(int id)
        {
            var entity = Get(id);
            db.Set<T>().Remove(entity);
            return Save();
        }

        public virtual List<T> FindAll()
        {
            return db.Set<T>().ToList();
        }
       
        private bool Save()
        {
            var save = db.SaveChanges();
            return save == 1;
        }
    }
}
