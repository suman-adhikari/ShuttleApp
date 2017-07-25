using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VShuttle.Model
{
    public class AjaxModel
    {  
        public int offset { get; set; }

        public int rowNumber { get; set; }

        public string sortExpression { get; set; }

        public string sortOrder { get; set; }

        public int pageNumber { get; set; }

        public string advanceSorting { get; set; }

    }
}