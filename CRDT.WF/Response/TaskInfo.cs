using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class TaskInfo
    {
        public string Category { get; set; }
        public string ModuleId { get; set; }
        public int UserId { get; set; }
        public string Account { get; set; }
        public bool? AgentFlag { get; set; }
    }
}
