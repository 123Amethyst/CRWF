using CRDT.WF.Response;
using System;

namespace CRDT.WF.Response
{
    public class JobRequestData
    {
        public DateTime EffectiveDate { get; set; }
        public ChangeCustomerDataReq Data { get; set; }
    }
}
