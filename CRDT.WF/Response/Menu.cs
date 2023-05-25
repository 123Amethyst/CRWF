using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class Menu
    {
        public long ModuleId { get; set; }
        public long ParModuleId { get; set; }
        public string ModuleCode { get; set; }
        public string ModuleName { get; set; }
        public string ModuleDesc { get; set; }
        public string ModulePath { get; set; }
        public string ImgUrl { get; set; }
        public int Step { get; set; }
        public bool IsClosed { get; set; }
        public bool IsActive { get; set; }
        public bool Checked { get; set; }
        public List<Menu> Children { get; set; }
    }
}
