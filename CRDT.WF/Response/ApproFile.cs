using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class ApproFile
    {
        public string RequestId { get; set; }
        public string FileName { get; set; }
        public string FileDesc { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
        public string FileServer { get; set; }
        public string FlowCode { get; set; }
        public long ApproUserId { get; set; }
        public string ApproUserName { get; set; }
        public string ApproDate { get; set; }
    }
}
