using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class GetCustomerDataAndCredit
    {
        public GetCustomerDataRes GetCustomerDataRes { get; set; }
        public GetCustomerCreditRes GetCustomerCreditRes { get; set; }
    }
}
