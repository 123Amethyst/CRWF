using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("ZCRDT_T_WFAR")]
    public class ZCRDT_T_WFAR
    {
        /// <summary>
        /// 主键
        /// </summary>
        [Key]
        public string REQID { get; set; }

        /// <summary>
        /// CUST_STATUS
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string CUST_STATUS { get; set; }

        /// <summary>
        /// CUST_TYPE
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string CUST_TYPE { get; set; }

        /// <summary>
        /// BUSINESS_NATURE
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string BUSINESS_NATURE { get; set; }

        /// <summary>
        /// MNRF
        /// </summary>		
        public decimal MNRF { get; set; }

        /// <summary>
        /// CREDIT_TERM
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string CREDIT_TERM { get; set; }

        /// <summary>
        /// CREDIT_TERM_SCORE
        /// </summary>		
        public decimal CREDIT_TERM_SCORE { get; set; }

        /// <summary>
        /// SEC_DEPOSIT
        /// </summary>		
        public decimal SEC_DEPOSIT { get; set; }

        /// <summary>
        /// SEC_DEPOSIT_SCORE
        /// </summary>		
        public decimal SEC_DEPOSIT_SCORE { get; set; }

        /// <summary>
        /// CREDIT_LIMIT
        /// </summary>		
        public decimal CREDIT_LIMIT { get; set; }

        /// <summary>
        /// BANKGUR_EXPDATE
        /// </summary>
        public DateTime? BANKGUR_EXPDATE { get; set; }

        /// <summary>
        /// RECONPRT
        /// </summary>
        [StringLength(3)]
        public string RECONPRT { get; set; }

        /// <summary>
        /// PRTOPT
        /// </summary>
        [StringLength(10)]
        public string PRTOPT { get; set; }

        /// <summary>
        /// TURNKEY
        /// </summary>		
        [StringLength(1)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string TURNKEY { get; set; }

        /// <summary>
        /// PERRL
        /// </summary>		
        [StringLength(2)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PERRL { get; set; }

        /// <summary>
        /// VALID_TO
        /// </summary>
        public DateTime? VALID_TO { get; set; }

        /// <summary>
        /// CRMANAGER
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string CRMANAGER { get; set; }

        /// <summary>
        /// SECURITY
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string SECURITY { get; set; }

        /// <summary>
        /// DEPOSIT_REF_NO
        /// </summary>		
        [StringLength(20)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string DEPOSIT_REF_NO { get; set; }

        /// <summary>
        /// RISK_CLASS
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string RISK_CLASS { get; set; }

        /// <summary>
        /// CHECK_RULE
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string CHECK_RULE { get; set; }

        /// <summary>
        /// BU_BKEXT
        /// </summary>		
        [StringLength(20)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string BU_BKEXT { get; set; }

        /// <summary>
        /// PayerNoOrKAAccountNo
        /// </summary>		
        [StringLength(30)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PAYER_NO { get; set; }

        /// <summary>
        /// AKONT
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string AKONT { get; set; }

    }
}
