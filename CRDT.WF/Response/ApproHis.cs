using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class ApproHis
    {
        public string RequestId { get; set; }
        public int SerNum { get; set; }
        public string PreStage { get; set; }
        public string PreStageName { get; set; }
        public string CurrStage { get; set; }
        public string CurrStageName { get; set; }
        public string ApproUserAccount { get; set; }
        public string ApproUserName { get; set; }
        public string ApproDate { get; set; }
        public string ApproType { get; set; }
        public string ApproTypeDesc { get; set; }
        public string ApproDesc { get; set; }
        public string ApproData { get; set; }
        public string ApproIP { get; set; }
        public string AgentUserAccount { get; set; }
        public string AgentUserName { get; set; }
    }
}
