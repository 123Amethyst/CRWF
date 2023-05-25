using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class ListItem
    {
        public ListItem()
        {
            Name = string.Empty;
            Remark = string.Empty;
        }
        public string Name { get; set; }
        public dynamic Value { get; set; }
        public string Remark { get; set; }
    }
}
