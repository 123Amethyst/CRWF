using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class UserProperty
    {
        public long? Id { get; set; }
        public long? UserId { get; set; }
        public long? ModuleId { get; set; }
        public string FieldName { get; set; }
        public string FieldValue { get; set; }
        public string FieldValueDesc { get; set; }
    }
}
