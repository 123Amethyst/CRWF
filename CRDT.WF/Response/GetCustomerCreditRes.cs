using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class GetCustomerCreditRes
    {        
        /// <summary>
        /// 請求號
        /// </summary>
        public string E_ZNUM { get; set; }

        /// <summary>
        /// SAP處理狀態(S:成功 E:失敗)
        /// </summary>
        public string E_ZSTATUS { get; set; }

        /// <summary>
        /// 消息類別
        /// </summary>
        public string E_ZMSGTYP { get; set; }

        /// <summary>
        /// 返回代碼
        /// </summary>
        public string E_ZMSGID { get; set; }

        /// <summary>
        /// 返回消息
        /// </summary>
        public string E_ZMSGTXT { get; set; }

        /// <summary>
        /// 返回文件名
        /// </summary>
        public string E_MESSAGE_V1 { get; set; }

        /// <summary>
        /// 返回JSON數據
        /// </summary>
        public string E_JSON { get; set; }

        public List<LT_RETURN> CreditData { get; set; }

        public List<LT_RETURN> LT_RETURN { get; set; }

    }

    public class LT_RETURN 
    {
        /// <summary>
        /// BUKRS
        /// </summary>
        public string BUKRS { get; set; }

        /// <summary>
        /// PARTNER
        /// </summary>
        public string PARTNER { get; set; }

        /// <summary>
        /// Credit Limit
        /// </summary>
        public string CREDIT_LIMIT { get; set; }

        /// <summary>
        /// VALID_TO
        /// </summary>
        public string VALID_DATE { get; set; }

        /// <summary>
        /// RISK_CLASS
        /// </summary>
        public string RISK_CLASS { get; set; }

        /// <summary>
        /// CHECK_RULE
        /// </summary>
        public string CHECK_RULE { get; set; }
    }
}
