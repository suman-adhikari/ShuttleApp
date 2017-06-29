﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using VShuttle.Model;
using VShuttle.Repository.Interface;

namespace VShuttle.Repository
{
    public class RoutesRepository : Repo, IRoutesRepository
    {
        public bool UpdateRoutes(int id, string routelocation)
        {

            var route = db.Route.FirstOrDefault(x => x.Id == id);
            route.RouteLocations = routelocation;
            db.SaveChanges();
            return true;           
        } 

        public List<Routes> FindAll()
        {
           return db.Route.ToList();
        }

    }
}
