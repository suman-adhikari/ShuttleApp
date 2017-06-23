using System;
using System.ComponentModel.DataAnnotations;

namespace VShuttle.Model
{
    public class UserInfo
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }
        
        public int Location { get; set; }

        public string SubLocation { get; set; }

        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Date { get; set; }
    
    }
}