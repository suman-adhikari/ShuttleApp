using System;
using System.ComponentModel.DataAnnotations;

namespace VShuttle.Model.ViewModel
{
    public class UserInfoLocation
    {
        public int Id { get; set; }

        public string INumber { get; set; }

        public string Name { get; set; }

        public string Location { get; set; }

        public string SubLocation { get; set; }

        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime Date { get; set; }
    }
}
