using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("SerNum")]
    public class SerNum
    {
        /// <summary>
        /// DateString
        /// </summary>
        public string DateString { get; set; }

        /// <summary>
        /// Num
        /// </summary>
        public int Num { get; set; }
    }
}
