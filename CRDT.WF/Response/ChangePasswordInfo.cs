using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class ChangePasswordInfo
    {
        public int UserId { get; set; }
        public string Account { get; set; }
        public string OldPasswd { get; set; }
        public string NewPasswd { get; set; }
        public string NewId { get; set; }
    }
}
