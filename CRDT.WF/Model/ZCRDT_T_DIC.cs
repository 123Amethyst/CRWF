using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("ZCRDT_T_DIC")]
    public class ZCRDT_T_DIC
    {
        /// <summary>
        /// ID
        /// </summary>		
        [Key]
        public int ID { get; set; }
        /// <summary>
        /// DTYPE
        /// </summary>		
        [StringLength(10)]
        public string DTYPE { get; set; }
        /// <summary>
        /// DCODE
        /// </summary>		
        [StringLength(10)]
        public string DCODE { get; set; }
        /// <summary>
        /// DNAME
        /// </summary>		
        [StringLength(50)]
        public string DNAME { get; set; }
        /// <summary>
        /// PTYPE
        /// </summary>		
        [StringLength(10)]
        public string PTYPE { get; set; }
        /// <summary>
        /// PCODE
        /// </summary>		
        [StringLength(10)]
        public string PCODE { get; set; }
        /// <summary>
        /// ERNAM
        /// </summary>		
        [StringLength(20)]
        public string ERNAM { get; set; }
        /// <summary>
        /// ERDAT
        /// </summary>		
        public DateTime ERDAT { get; set; }
        /// <summary>
        /// AENAM
        /// </summary>		
        [StringLength(20)]
        public string AENAM { get; set; }
        /// <summary>
        /// AEDAT
        /// </summary>		
        public DateTime? AEDAT { get; set; }
    }
}
