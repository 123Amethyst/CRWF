using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("CVNormal")]
    public class CVNormal
    {
        public string SPRAS { get; set; }
        public string CORE_ID { get; set; }
        public string CORE_VALUE { get; set; }
        public string VALUE_TEXT { get; set; }
        public string SYSID { get; set; }
        public int SEQNO { get; set; }
        public string AENAM { get; set; }
        public string AEDAT { get; set; }
        public string AEZET { get; set; }
    }
}
