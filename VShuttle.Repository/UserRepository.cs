using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using VShuttle.Model;

namespace VShuttle.Repository
{
    public class UserRepository : Repo
    {

        public Users CheckUser(Users users)
        {
            var user = db.User.FirstOrDefault(Model => Model.UserId == users.UserId && Model.Password == users.Password);          
            return user;
        }

        public bool Add(Users users)
        {
            db.User.Add(users);
            db.SaveChanges();
            return true;
        }



    }
}
