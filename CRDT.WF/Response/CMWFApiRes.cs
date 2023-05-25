using CRDT.WF.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class CMWFApiRes
    {
        public string effectiveDate { get; set; }
        public string applicationDate { get; set; }
        public string flowStatus { get; set; }
        }
    }
