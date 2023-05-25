using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class GetCustomerCreditReq
    {
        /// <summary>
        /// /請求流水號
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
    }
}
