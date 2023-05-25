using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class GetCodeAndValueReq
    {
        public string IM_ZSOURCE { get; set; }
        public string IM_BUKRS { get; set; }
        public string IM_ZNUM { get; set; }
        public string IM_FILTERMAPTABLE { get; set; }
        public string IM_FILE { get; set; }
    }
}
