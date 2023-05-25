using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class Authen
    {
        public int ModuleId { get; set; }
        public string Account { get; set; }
        public string Passwd { get; set; }
    }
}
