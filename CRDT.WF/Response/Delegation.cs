using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class Delegation
    {
        public long AgentId { get; set; }
        public long FromUserId { get; set; }
        public long ToUserId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public bool AgentAll { get; set; }
        public bool IfNotify { get; set; }
    }
}
