using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("ZCRDT_T_CACHE")]
    public class ZCRDT_T_CACHE
    {
        public string KUNNR { get; set; }
        public string BUKRS { get; set; }
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string CUST_STATUS { get; set; }
        public decimal MNRF { get; set; }
        public decimal SEC_DEPOSIT { get; set; }
        public decimal SEC_DEPOSIT_SCORE { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string SECURITY { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string DEPOSIT_REF_NO { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PAYER_NO { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PHONE1_EXT { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PHONE2_EXT { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string REMARK { get; set; }
    }
}
