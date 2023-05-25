using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("ZCRDT_T_WFHD")]
    public class ZCRDT_T_WFHD
    {
        /// <summary>
        /// 主键
        /// </summary>
        [Key]
        public string REQID { get; set; }

        /// <summary>
        /// FLWCD
        /// </summary>		
        [StringLength(200)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string FLWCD { get; set; }

        /// <summary>
        /// FLWNM
        /// </summary>		
        [StringLength(50)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string FLWNM { get; set; }

        /// <summary>
        /// ACTCD
        /// </summary>		
        [StringLength(20)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ACTCD { get; set; }

        /// <summary>
        /// ACTNM
        /// </summary>		
        [StringLength(50)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ACTNM { get; set; }

        /// <summary>
        /// USRID
        /// </summary>		
        [StringLength(20)]
        public string USRID { get; set; }

        /// <summary>
        /// USRNM
        /// </summary>		
        [StringLength(50)]
        public string USRNM { get; set; }

        /// <summary>
        /// APPTYPE
        /// </summary>		
        [StringLength(10)]
        public string APPTYPE { get; set; }

        /// <summary>
        /// PLANT
        /// </summary>		
        [StringLength(10)]
        public string PLANT { get; set; }

        /// <summary>
        /// PLANT_NAME
        /// </summary>		
        [StringLength(50)]
        public string PLANT_NAME { get; set; }

        /// <summary>
        /// DEPTC
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string DEPTC { get; set; }

        /// <summary>
        /// DEPTN
        /// </summary>		
        [StringLength(50)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string DEPTN { get; set; }

        /// <summary>
        /// POSTXT
        /// </summary>		
        [StringLength(50)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string POSTXT { get; set; }

        /// <summary>
        /// ACTION
        /// </summary>		
        [StringLength(50)]
        public string ACTION { get; set; }

        /// <summary>
        /// APDAT
        /// </summary>		
        public DateTime APDAT { get; set; }

        /// <summary>
        /// DETAILS
        /// </summary>		
        [StringLength(200)]
        public string DETAILS { get; set; }

        /// <summary>
        /// MESSAGE
        /// </summary>		
        [StringLength(220)]
        public string MESSAGE { get; set; }

        /// <summary>
        /// DELFG
        /// </summary>		
        [StringLength(1)]
        public string DELFG { get; set; }

        /// <summary>
        /// ERNAM
        /// </summary>		
        [StringLength(20)]
        public string ERNAM { get; set; }

        /// <summary>
        /// ERTXT
        /// </summary>		
        [StringLength(50)]
        public string ERTXT { get; set; }

        /// <summary>
        /// ERDAT
        /// </summary>		
        public DateTime ERDAT { get; set; }

        /// <summary>
        /// ERTXT
        /// </summary>		
        [StringLength(20)]
        public string AENAM { get; set; }

        /// <summary>
        /// AEDAT
        /// </summary>		
        public DateTime? AEDAT { get; set; }
    }
}
