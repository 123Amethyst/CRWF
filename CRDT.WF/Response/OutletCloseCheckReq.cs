using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class OutletCloseCheckReq
    {
        public string IM_BUKRS { get; set; }

        public string IM_ZNUM { get; set; }

        public string IM_ZSOURCE { get; set; }

        public List<Kunnr> IM_KUNNR { get; set; }
    }

    public class Kunnr 
    {
        public string SIGN { get; set; }
        public string OPTION { get; set; }
        public string LOW { get; set; }
        public string HIGH { get; set; }
    }
}
