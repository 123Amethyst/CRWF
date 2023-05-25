using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class Stage
    {
        public string StageCode { get; set; }
        public string StageName { get; set; }
        public string StageDesc { get; set; }
        public string FlowCode { get; set; }
        public int RolePassType { get; set; }
        public int ModuleId { get; set; }
        public bool IfBinary { get; set; }
        public bool IfAuto { get; set; }
        public bool IfCanSkip { get; set; }
        public bool IfAsync { get; set; }
        public bool IsActive { get; set; }
    }
}
