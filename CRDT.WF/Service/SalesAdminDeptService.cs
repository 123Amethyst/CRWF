using CRDT.WF.Data;
using CRDT.WF.Model;
using CRDT.WF.Response;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CRDT.WF.Controllers;
using CRDT.WF.Interface;
using Microsoft.Extensions.Localization;
using Ui5.Data;

namespace CRDT.WF.Service
{
    public class SalesAdminDeptService: BaseController
    {
        private TestContext _context;
        protected string CultureLanguages;
        public SalesAdminDeptService(IStringLocalizer<HomeController> localizer, IUnitWork unitWork) : base(localizer, unitWork)
        {
            _context = UnitWork.GetDbContext(SqlHelper.GetConnectingString("CRDTDBContext"));
            CultureLanguages = System.Globalization.CultureInfo.CurrentCulture.Name;
        }
        public TestContext GetContext(string connectionString)
        {
            var optionsBuilder = new DbContextOptionsBuilder<TestContext>();
            optionsBuilder.UseSqlServer(connectionString);
            TestContext _context1 = new TestContext(optionsBuilder.Options);
            return _context1;
        }

        #region 获取SalesAdmin-Region-Dept列表并分页
        /// <summary>
        /// 获取SalesAdmin-Region-Dept列表并分页
        /// </summary>
        /// <param name="BUKRS">公司编码</param>
        /// <param name="pageReq">分页参数</param>
        /// <returns></returns>
        public ResponseData GetSalesAdminRegionDeptList(PageReq pageReq)
        {
            var res = new ResponseData();
            var query = from cd in UnitWork.Find<SalesAdminDept>()
                        select new
                        {
                            cd.CompanyCode,
                            cd.SalesAdmin,
                            cd.Region,
                            cd.DeptCode,
                            cd.DeptName,
                            cd.CreateUserId,
                            cd.CreateDate,
                            cd.UpdateUserId,
                            cd.UpdateDate,
                        };
            query = query.AsQueryable().Where(pageReq);
            res.Data = query.AsQueryable().Paging(pageReq).ToList();
            res.Count = query.Count();
            return res;
        }
        #endregion

        #region 获取部门组编码通过公司编码、SalesAdmin、Region
        /// <summary>
        /// 获取部门组编码通过公司编码、SalesAdmin、Region
        /// </summary>
        /// <param name="BUKRS">公司编码</param>
        /// <param name="SalesAdmin">SalesAdmin</param>
        /// <param name="Region">区域</param>
        /// <returns></returns>
        public string GetSalesAdminDeptBySalesAdminRegion(string BUKRS, string SalesAdmin, string Region)
        {
            var dept = "";
            var salesAdminDept = UnitWork.FindSingle<SalesAdminDept>(u => u.CompanyCode.Equals(BUKRS) && u.SalesAdmin.Equals(SalesAdmin) && u.Region.Equals(Region));
            if (salesAdminDept != null)
            {
                dept = salesAdminDept.DeptCode;
            }
            return dept;
        } 
        #endregion

        #region 通过语言类型和公司编码查询SalesAdmin数据源
        /// <summary>
        /// 通过语言类型和公司编码查询SalesAdmin数据源
        /// </summary>
        /// <param name="SPRAS">语言类型</param>
        /// <param name="BUKRS">公司编码</param>
        /// <returns></returns>
        public ResponseData GetSalesAdminListByBukrs(string SPRAS, string BUKRS)
        {
            var res = new ResponseData();
            var query = UnitWork.Find<SalesAdmin>(x => x.SPRAS.Equals(SPRAS) && x.BUKRS.Equals(BUKRS));
            var data = query.AsQueryable().ToList();
            res.Data = data;
            return res;
        }
        #endregion

        #region 获取序列号
        /// <summary>
        /// 获取序列号
        /// </summary>
        /// <returns></returns>
        public string GetRequestId(string type)
        {
            int res = 1;
            if (type == "RequestId")
            {
                var Date = DateTime.Now.ToString("yyyyMMdd");
                var query = UnitWork.Find<SerNum>(u => u.DateString.Equals(Date)).OrderByDescending<SerNum, int>(x => x.Num).FirstOrDefault();
                if (query != null)
                {
                    res = query.Num + 1;
                    UnitWork.Add(new SerNum
                    {
                        DateString = Date,
                        Num = query.Num + 1
                    });
                }
                else
                {
                    UnitWork.Add(new SerNum
                    {
                        DateString = Date,
                        Num = res
                    });
                }
            }
            else if (type == "Dept")
            {
                var query = UnitWork.Find<SerNum>(u => u.DateString.Equals("820005")).OrderByDescending<SerNum, int>(x => x.Num).FirstOrDefault();
                if (query != null)
                {
                    res = query.Num + 1;
                    UnitWork.Add(new SerNum
                    {
                        DateString = "820005",
                        Num = query.Num + 1
                    });
                }
                else
                {
                    UnitWork.Add(new SerNum
                    {
                        DateString = "820005",
                        Num = res
                    });
                }
            }

            UnitWork.Save();
            return res.ToString().PadLeft(4, '0');
        } 
        #endregion

        #region 销售管理员-区域-部门组保存
        /// <summary>
        /// 销售管理员-区域-部门组保存
        /// </summary>
        /// <param name="id">主键</param>
        /// <param name="data">表单数据</param>
        /// <returns></returns>
        public ResponseData SaveSalesAdminDept(SalesAdminDept salesAdminDeptModel,Token token)
        {
            var res = new ResponseData();
            var salesAdminDept = UnitWork.FindSingle<SalesAdminDept>(u => u.CompanyCode.Equals(salesAdminDeptModel.CompanyCode)&&u.SalesAdmin.Equals(salesAdminDeptModel.SalesAdmin)&&u.Region.Equals(salesAdminDeptModel.Region));
            if (salesAdminDept != null)
            {
                //salesAdminDeptModel.UpdateDate = DateTime.Now;
                //UnitWork.Update(salesAdminDeptModel);
                //UnitWork.Save();
                throw new Exception("该配置数据已存在!");
            }
            else
            {
                var dept = new Dept();
                if (salesAdminDeptModel.CompanyCode == "8100")
                {
                    dept.ParDeptId = 4;
                }
                else if (salesAdminDeptModel.CompanyCode == "8200")
                {
                    dept.ParDeptId = 5;
                }
                dept.DeptCode = salesAdminDeptModel.CompanyCode + "05" + GetRequestId("Dept");
                dept.DeptName = salesAdminDeptModel.CompanyCode + "_" + salesAdminDeptModel.SalesAdmin + (salesAdminDeptModel.Region == "" ? "" : ("_" + salesAdminDeptModel.Region));
                dept.DeptDesc = "SalesAdminRegionDept";
                salesAdminDeptModel.DeptCode = dept.DeptCode;
                salesAdminDeptModel.DeptName = dept.DeptName;
                salesAdminDeptModel.CreateDate = DateTime.Now;
                UnitWork.Add(salesAdminDeptModel);
                UnitWork.Save();
                res = SaveDept(dept, token);
            }
            return res;
        }
        #endregion

        #region 保存部门组信息
        /// <summary>
        /// 保存部门组信息
        /// </summary>
        /// <param name="dept">部门组信息</param>
        /// <param name="token"></param>
        public ResponseData SaveDept(Dept dept, Token token)
        {
            ResponseData res = new ResponseData();
            res = PostAsync<ResponseData, Dept>("api/Dept", dept, token);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }
        #endregion

        /// <summary>
        /// 获取部门
        /// </summary>
        /// <returns></returns>
        public APIResponseData<List<Dept>> GetDeptList(string parId,string deptCode, Token token)
        {
            return GetAsync<APIResponseData<List<Dept>>>("api/Dept/?parid=" + parId+ "&code="+ deptCode+"&name=", token);
        }

        #region SalesAdmin-Region-Dept信息删除
        /// <summary>
        /// 字典信息删除
        /// </summary>
        /// <param name="companyCode">公司编码</param>
        /// <param name="salesAdmin">销售管理员</param>
        /// <param name="region">区域</param>
        public void DeleteSalesAdminDept(string companyCode,string salesAdmin,string region)
        {
            var salesAdminDept = UnitWork.FindSingle<SalesAdminDept>(u => u.CompanyCode.Equals(companyCode)&&u.SalesAdmin.Equals(salesAdmin)&&u.Region.Equals(region));
            if (salesAdminDept != null)
            {
                UnitWork.Delete<SalesAdminDept>(u => u.CompanyCode.Equals(companyCode) && u.SalesAdmin.Equals(salesAdmin) && u.Region.Equals(region));
                UnitWork.Save();
            }
        }
        #endregion      
    }
}
