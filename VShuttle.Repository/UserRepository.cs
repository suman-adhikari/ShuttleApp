using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using VShuttle.Model;

namespace VShuttle.Repository
{
    public class UserRepository : Repo<Users>
    {

        public Users CheckUser(Users users)
        {
            var user = db.User.FirstOrDefault(m => m.INumber == users.INumber && m.Password == users.Password);          
            return user;
        }

     

        public bool CheckINumber(string iNumber)
        {
            var IsINumberUsed = db.User.FirstOrDefault(m => m.INumber == iNumber);
            return IsINumberUsed == null;
        }



    }
}
