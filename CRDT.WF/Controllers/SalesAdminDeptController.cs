using CRDT.WF.Interface;
using CRDT.WF.Model;
using CRDT.WF.Response;
using CRDT.WF.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Controllers
{
    public class SalesAdminDeptController : BaseController
    {
        private SalesAdminDeptService _SalesAdminDeptService;
        public SalesAdminDeptController(IStringLocalizer<HomeController> localizer, IUnitWork unitWork) : base(localizer, unitWork)
        {
            _SalesAdminDeptService = new SalesAdminDeptService(localizer, unitWork);
        }
        #region 获取SalesAdmin-Region-Dept列表并分页
        /// <summary>
        /// 获取SalesAdmin-Region-Dept列表并分页
        /// </summary>
        /// <param name="BUKRS">公司编码</param>
        /// <param name="pageReq">分页参数</param>
        /// <returns></returns>
        [HttpPost]
        public ResponseData GetSalesAdminRegionDeptList([FromForm] PageReq pageReq)
        {
            var res = new ResponseData();
            try
            {
                res = _SalesAdminDeptService.GetSalesAdminRegionDeptList(pageReq);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
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
        public ResponseData GetSalesAdminDeptBySalesAdminRegion(string BUKRS, string SalesAdmin, string Region) 
        {
            var res = new ResponseData();
            try
            {
                if (Region==null) 
                {
                    Region = "";
                }
                //获取deptCode
                var deptCode = _SalesAdminDeptService.GetSalesAdminDeptBySalesAdminRegion(BUKRS, SalesAdmin, Region);
                if (deptCode != "")
                {
                    res.Data = deptCode;
                }
                else 
                {
                    throw new Exception("ymsg.SalesAdminDeptCheck");
                }
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
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
            try
            {
                res = _SalesAdminDeptService.GetSalesAdminListByBukrs(SPRAS, BUKRS);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region SalesAdmin-Region-Dept信息保存
        /// <summary>
        /// SalesAdmin-Region-Dept信息保存
        /// </summary>
        /// <param name="id">主键</param>
        /// <param name="data">表单数据</param>
        /// <returns></returns>
        [HttpPost]
        public ResponseData SaveSalesAdminDept([FromForm] SalesAdminDept salesAdminDeptModel,Token token)
        {
            var res = new ResponseData();
            try
            {                
                res = _SalesAdminDeptService.SaveSalesAdminDept(salesAdminDeptModel,token);               
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region SalesAdmin-Region-Dept信息删除
        /// <summary>
        /// SalesAdmin-Region-Dept信息删除
        /// </summary>
        /// <param name="companyCode">公司编码</param>
        /// <param name="salesAdmin">销售管理员</param>
        /// <param name="region">区域</param>
        public ResponseData DeleteSalesAdminDept(string companyCode, string salesAdmin, string region)
        {
            var res = new ResponseData();
            try
            {
                if (region==null) 
                {
                    region = "";
                }
                _SalesAdminDeptService.DeleteSalesAdminDept(companyCode, salesAdmin, region);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion
    }
}
