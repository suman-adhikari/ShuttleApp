using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VShuttle.Model
{
    public class AjaxGridResult
    {
            public int RowCount { get; set; }

            public object Data { get; set; }

            public int pageNumber { get; set; }

    }
}