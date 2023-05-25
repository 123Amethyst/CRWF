using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class DDLField
    {
        public string id { get; set; }
        public string text { get; set; }
        public string description { get; set; }
        public bool selected { get; set; }
        public dynamic val { get; set; }
    }
}
