using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class PasswdLogRes
    {
        public string NewId { get; set; }
        public int UserId { get; set; }
        public string Account { get; set; }
        public string DisplayName { get; set; }
        public int ModuleId { get; set; }
        public string Status { get; set; }
        public string CreateUserId { get; set; }
        public string CreateDate { get; set; }
        public string CreateIP { get; set; }
        public int? UpdateUserId { get; set; }
        public string UpdateDate { get; set; }
        public string UpdateIP { get; set; }
    }
}
