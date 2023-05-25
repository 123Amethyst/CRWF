using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class User
    {
        public long UserId { get; set; }
        public string Account { get; set; }
        public string DisplayName { get; set; }
        public bool IsActive { get; set; }
        public List<UserProperty> UserAttributes { get; set; }
    }
}
