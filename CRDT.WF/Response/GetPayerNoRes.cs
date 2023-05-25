using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class GetPayerNoRes
    {
        public string EV_ZNUM { get; set; }
        public string EV_BPARTNER { get; set; }
        public string EV_ZSTATUS { get; set; }
        public string EV_MESSAGEID { get; set; }
        public string EV_MESSAGENUMBER { get; set; }
        public string EV_MESSAGE { get; set; }
    }
}
