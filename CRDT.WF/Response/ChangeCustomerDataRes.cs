using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{

    public class ChangeCustomerDataRes
    {
        public string ZNUM { get; set; }
        public string BUKRS { get; set; }
        public string PARTNER { get; set; }
        public string ZSTATUS { get; set; }
        public string ZMSGTYP { get; set; }
        public string ZMSGID { get; set; }
        public string ZMSGTXT { get; set; }
        public string MESSAGE_V1 { get; set; }
    }
}
