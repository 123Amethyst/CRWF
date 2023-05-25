using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("CreditManager")]
    public class CreditManager
    {
        public string SPRAS { get; set; }
        public string BUKRS { get; set; }
        public string ZZSALESADMIN { get; set; }
        public string ZZCRMANAGER { get; set; }
        public string ZZCRNAME { get; set; }
        public string CHUSR { get; set; }
        public string CHDAT { get; set; }
        public string CHTIM { get; set; }
        public string SYSID { get; set; }
        public int SEQNO { get; set; }
        public string AENAM { get; set; }
        public string AEDAT { get; set; }
        public string AEZET { get; set; }
    }
}
