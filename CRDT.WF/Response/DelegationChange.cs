using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class DelegationChange
    {
        public long AgentId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public bool AgentAll { get; set; }
        public bool IfNotify { get; set; }
    }
}
