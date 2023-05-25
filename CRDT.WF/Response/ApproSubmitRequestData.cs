using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class ApproSubmitRequestData
    {
        public string BUKRS { get; set; }
        public string BUKRS_NAME { get; set; }
        public string CATEGORY { get; set; }
        public string CATEGORY_NAME { get; set; }
        public decimal TOTAL_AMT { get; set; }
        public string ApproverName { get; set; }
        public string SalesAdmin { get; set; }
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ApproDesc { get; set; }
        public int CLAIM_USERID { get; set; }
        public string CLAIM_USER_NAME { get; set; }
        public int CREATOR_USERID { get; set; }
        public string CREATOR_NAME { get; set; }
    }
}
