using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class OutletCloseCheckRes
    {
        public List<ResultData> ET_DATA { get; set; }
        public List<MessageData> ET_MESSAGE { get; set; }
    }

    public class ResultData 
    {
        public string BUKRS { get; set; }
        public string KUNNR { get; set; }
        public string ZZCUSTSTATUS { get; set; }
        public string DMBTR { get; set; }
        public string KULAB { get; set; }
        public string SALK3 { get; set; }
        public string NETWR { get; set; }
        public string FKLMG { get; set; }
        public List<ZOPENCO> ZOPENCO { get; set; }
        public List<ZopenSo>  ZOPENSO { get; set; }
        public List<Zqeuino>  ZQEUINO { get; set; }
        public string PAYER_assigned { get; set; }
        public string Security_deposit { get; set; }
    }

    public class MessageData
    {
        public string ZNUM { get; set; }
        public string ZSOURCE { get; set; }
        public string ZSTATUS { get; set; }
        public string ZMSGTYP { get; set; }
        public string ZMSGID { get; set; }
        public string MESSAGE { get; set; }
    }
    public class ZOPENCO
    {
        public string VBAK_VBELN {get; set;}
        public string ANWSO { get; set; }

    }

    public class Fklmg 
    {
        public string VBAK_VBELN { get; set; }
        public string ANWSO { get; set; }
    }
    public class ZopenSo
    {
        public string VBELN { get; set; }
        public string VDATU { get; set; }
    }
    public class Zqeuino
    {
        public string EQUNR { get; set; }
        public string TXT04 { get; set; }
    }
}
