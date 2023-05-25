using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("ZCRDT_T_WFBR")]
    public class ZCRDT_T_WFBR
    {
        /// <summary>
        /// 主键
        /// </summary>
        [Key]
        public string REQID { get; set; }

        /// <summary>
        /// IDNUMBER
        /// </summary>		
        [StringLength(20)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string IDNUMBER { get; set; }

        /// <summary>
        /// INSTITUTE
        /// </summary>		
        [StringLength(50)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string INSTITUTE { get; set; }

        /// <summary>
        /// VALID_DATE_FROM
        /// </summary>
        public DateTime? VALID_DATE_FROM { get; set; }

        /// <summary>
        /// VALID_DATE_TO
        /// </summary>
        public DateTime? VALID_DATE_TO { get; set; }
    }
}
