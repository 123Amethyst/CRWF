using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class DelegationListRes
    {
        public long AgentId { get; set; }
        public long FromUserId { get; set; }
        public string FromAccount { get; set; }
        public string FromUserName { get; set; }
        public long ToUserId { get; set; }
        public string ToAccount { get; set; }
        public string ToUserName { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public bool AgentAll { get; set; }
        public bool IfNotify { get; set; }
        public string AgentDate { get; set; }
    }
}
