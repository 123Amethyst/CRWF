using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class TaskListRes
    {
        public string RequestId { get; set; }
        public long UserId { get; set; }
        public string Account { get; set; }
        public string UserName { get; set; }
        public string FlowCode { get; set; }
        public string StageCode { get; set; }
        public string StageName { get; set; }
        public bool PassFlag { get; set; }
        public string UpdateDate { get; set; }

        public string UserList { get; set; }
        public string AgentUserName { get; set; }
    }
}
