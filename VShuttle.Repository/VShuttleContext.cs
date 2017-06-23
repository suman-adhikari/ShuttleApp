using System;
using System.Collections.Generic;
using System.Data.Entity;
using VShuttle.Model;

namespace VShuttle.Repository
{
    public class VShuttleContext : DbContext
    {
        public VShuttleContext(): base("Vshuttle")
        {

        }

        public DbSet<Users> User { get; set; }
        public DbSet<UserInfo> UserInfos { get; set; }
        public DbSet<Locations> Locations { get; set; }
        public DbSet<Routes> Route { get; set; }

    }
}