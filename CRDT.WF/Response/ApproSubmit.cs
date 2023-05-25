using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class ApproSubmit
    {
        public string RequestId { get; set; }
        public string FlowCode { get; set; }
        public string StageCode { get; set; }
        public string NextStage { get; set; }
        public string ApproType { get; set; }
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ApproDesc { get; set; }
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string IP { get; set; }
        public int ApproUserId { get; set; }
        public int? AgentUserId { get; set; }
        public dynamic RequestData { get; set; }
    }
}
