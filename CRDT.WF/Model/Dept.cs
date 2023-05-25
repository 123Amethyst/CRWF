using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("Dept")]
    public class Dept
    {
        public int DeptId { get; set; }
        public int ParDeptId { get; set; }
        public string DeptCode { get; set; }
        public string DeptName { get; set; }
        public string DeptDesc { get; set; }
        public bool IsActive { get; set; }
    }
}
