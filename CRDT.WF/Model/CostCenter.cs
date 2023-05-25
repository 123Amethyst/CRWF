using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("CostCenter")]
    public class CostCenter
    {
        public string BUKRS { get; set; }
        public string CODE { get; set; }
        public string DESCR { get; set; }
        public string OBJNR { get; set; }
        public string PRCTR { get; set; }
        public string AENAM { get; set; }
        public string AEDAT { get; set; }
        public string AEZET { get; set; }
    }
}
