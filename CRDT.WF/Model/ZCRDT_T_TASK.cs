using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("ZCRDT_T_TASK")]
    public class ZCRDT_T_TASK
    {
        public string RequestId { get; set; }

        public string StageCode { get; set; }

        public int UserId { get; set; }

        public string Account { get; set; }

        public string UserName { get; set; }

        public string StageName { get; set; }

        public bool PassFlag { get; set; }

        public DateTime CreateDate { get; set; }

        public int? AgentUserId { get; set; }

        public DateTime? UpdateDate { get; set; }
    }
}
