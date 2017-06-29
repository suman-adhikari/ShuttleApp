using System.Configuration;

namespace VShuttle.Repository
{
    public class Repo
    {
        public string connectionString;
        public VShuttleContext db;

        public Repo()
        {
            db = new VShuttleContext();
        }     
    }
}
