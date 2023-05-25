using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class CustomerCreditReq
    {
        public string I_ZNUM { get; set; }
        public string I_ZSOURCE { get; set; }
        public string I_BUKRS { get; set; }
        public string I_PARTNER { get; set; }
        public string I_LIMIT_RULE { get; set; }
        public string I_CREDIT_SGMNT { get; set; }
        public string I_CHECK_RULE { get; set; }
        public string I_RISK_CLASS { get; set; }
        public string I_CREDIT_LIMIT { get; set; }
        public string I_LIMIT_VALID_DATE { get; set; }
        public string I_CREDIT_GROUP { get; set; }
    }
}
