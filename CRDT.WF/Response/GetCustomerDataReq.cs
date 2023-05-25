using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class GetCustomerDataReq
    {
        /// <summary>
        /// 請求流水號
        /// </summary>
        public string I_ZNUM { get; set; }
        /// <summary>
        /// 請求來源
        /// </summary>
        public string I_ZSOURCE { get; set; }
        /// <summary>
        /// 公司代碼
        /// </summary>
        public string I_BUKRS { get; set; }
        /// <summary>
        /// BP 號碼
        /// </summary>
        public string I_PARTNER { get; set; }
        /// <summary>
        /// 變更開始日期
        /// </summary>
        public string I_DATAB { get; set; }
        /// <summary>
        /// 變更開始時間
        /// </summary>
        public string I_TIMAB { get; set; }
        /// <summary>
        /// 變更結束日期
        /// </summary>
        public string I_DATBI { get; set; }
        /// <summary>
        /// 變更結束時間
        /// </summary>
        public string I_TIMBI { get; set; }
        public string I_SAP { get; set; }
    }
}
