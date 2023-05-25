using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class AddPasswdLog
    {
        public AddPasswdLog()
        {
            Profile = "CRDT";
            CreateUserId = 1;
            CreateIP = "";
        }
        public int UserId { get; set; }
        public string ModuleId { get; set; }
        public string Profile { get; set; }
        public string SendTo { get; set; }
        public int CreateUserId { get; set; }
        public string CreateIP { get; set; }
    }
}
