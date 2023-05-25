using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class ApproSubmitRes
    {
        public string RequestId { get; set; }
        public string StageCode { get; set; }
        public string StageName { get; set; }
        public List<UserItem> UserList { get; set; }
    }

    public class UserItem
    {
        public int UserId { get; set; }
        public string Account { get; set; }
        public string UserName { get; set; }
        public bool PassFlag { get; set; }
    }
}
