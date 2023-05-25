using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class CustomerCreditRes
    {
        /// <summary>
        /// 請求流水號
        /// </summary>
        public string E_ZNUM { get; set; }

        /// <summary>
        /// Credit Segment
        /// </summary>
        public string E_CREDIT_SGMNT { get; set; }

        /// <summary>
        /// BP Num
        /// </summary>
        public string E_KUNNR { get; set; }

        /// <summary>
        /// SAP處理狀態(S Success, E Error, W Warning, I Info, A Abort)
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
    }
}
