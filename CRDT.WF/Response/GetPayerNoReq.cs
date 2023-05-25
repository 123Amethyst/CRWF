using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class GetPayerNoReq
    {
        public string IV_BPTYPE { get; set; }
        public string IV_ZNUM { get; set; }
        public string IV_ZSOURCE { get; set; }
    }
}
