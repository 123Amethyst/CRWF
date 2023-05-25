using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("SalesAdminDept")]
    public class SalesAdminDept
    {
        /// <summary>
        /// 公司编码
        /// </summary>		
        public string CompanyCode { get; set; }

        /// <summary>
        /// 销售管理
        /// </summary>		
        public string SalesAdmin { get; set; }

        /// <summary>
        /// 区域
        /// </summary>		
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Region { get; set; }

        /// <summary>
        /// 部门编码
        /// </summary>		
        public string DeptCode { get; set; }

        /// <summary>
        /// 部门名称
        /// </summary>		
        public string DeptName { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>		
        public int CreateUserId { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>		
        public DateTime CreateDate { get; set; }

        /// <summary>
        /// 修改人
        /// </summary>		
        public int? UpdateUserId { get; set; }

        /// <summary>
        /// 修改日期
        /// </summary>		
        public DateTime? UpdateDate { get; set; }
    }
}
