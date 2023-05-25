using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("ApproFileUser", Schema = "flw")]
    public class ApproFileUser
    {
        /// <summary>
        /// FlowCode
        /// </summary>
        [Key]
        [StringLength(200)]
        public string FlowCode { get; set; }
        /// <summary>
        /// RequestId
        /// </summary>
        [StringLength(200)]
        public string RequestId { get; set; }
        /// <summary>
        /// FileName
        /// </summary>
        [StringLength(200)]
        public string FileName { get; set; }
        /// <summary>
        /// FileLink
        /// </summary>
        [StringLength(2000)]
        public string FileLink { get; set; }
        /// <summary>
        /// ApproUser
        /// </summary>
        [StringLength(20)]
        public string ApproUser { get; set; }
        /// <summary>
        /// ProcStatus
        /// </summary>
        [StringLength(64)]
        public string ProcStatus { get; set; }
        /// <summary>
        /// ApproDate
        /// </summary>
        public DateTime ApproDate { get; set; }
        /// <summary>
        /// FileType
        /// </summary>
        [StringLength(20)]
        public string FileType { get; set; }
        /// <summary>
        /// SourseType
        /// </summary>
        [StringLength(20)]
        public string SourseType { get; set; }
    }
}
