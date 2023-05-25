using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Response
{
    public class UserInfo
    {
        public UserInfo()
        {
            RoleId = new List<string>();
            SalesAdmin = new List<string>();
            Company= new List<string>();
            CompanyName = new List<string>();
        }
        public long UserId { get; set; }
        public string Account { get; set; }
        public string AccountName { get; set; }
        public List<string> Company { get; set; }
        public List<string> CompanyName { get; set; }
        public string Department { get; set; }
        public string DepartmentName { get; set; }
        public string CostCenter { get; set; }
        public string CostCenterName { get; set; }
        public string Position { get; set; }
        public string PositionName { get; set; }
        public string Email { get; set; }
        public string EmpCode { get; set; }
        public string Leader { get; set; }
        public string LeadName { get; set; }
        public string ProfitCenter { get; set; }
        public string ProfitCenterName { get; set; }
        public string LeaderCompany { get; set; }
        public string LeaderCompanyName { get; set; }
        public string Tel { get; set; }
        public string Vendor { get; set; }
        public string Level { get; set; }
        public string WorkCompany { get; set; }
        public string WorkCompanyName { get; set; }
        public string Gender { get; set; }
        public List<string> SalesAdmin { get; set; }
        public string SalesRegion { get; set; }
        public List<string> RoleId { get; set; }
    }
}
