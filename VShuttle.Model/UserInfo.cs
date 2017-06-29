using System;
using System.ComponentModel.DataAnnotations;

namespace VShuttle.Model
{
    public class UserInfo
    {
        public int Id { get; set; }

        public string INumber { get; set; }

        public string Name { get; set; }
        
        public int Location { get; set; }

        public string SubLocation { get; set; }

        public DateTime Date { get; set; }

    
    }
}