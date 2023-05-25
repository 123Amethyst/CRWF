using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class PasswdLog
    {
        public string NewId { get; set; }
        public int UpdateUserId { get; set; }
        public string UpdateIP { get; set; }
    }
}
