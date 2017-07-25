using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VShuttle.Model
{
    public class Users
    {
        public int Id { get; set; }

        public string INumber { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public int UserRole { get; set; }
    }
}