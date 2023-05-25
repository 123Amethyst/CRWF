using CRDT.WF.Data;
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
    public class DictionaryController : BaseController
    {
        private DictionaryService _DictionaryService;
        public DictionaryController(IStringLocalizer<HomeController> localizer, IUnitWork unitWork) : base(localizer, unitWork)
        {
            _DictionaryService = new DictionaryService(localizer, unitWork);
        }

        #region 查询字典类型
        /// <summary>
        /// 查询字典类型
        /// </summary>
        /// <returns></returns>
        public ResponseData GetDicType()
        {
            var res = new ResponseData();
            try
            {
                res = _DictionaryService.GetDicType();
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }

            return res;
        }
        #endregion

        #region 通过字典类型获取列表
        /// <summary>
        /// 通过字典类型获取列表
        /// </summary>
        /// <param name="type">字典类型</param>
        /// <returns></returns>
        public ResponseData GetDicListByType(string type)
        {
            var res = new ResponseData();
            try
            {
                res = _DictionaryService.GetDicListByType(type);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }

            return res;
        }
        #endregion

        #region 通过字典类型和父级类型父级编码获取列表
        /// <summary>
        /// 通过字典类型获取列表
        /// </summary>
        /// <param name="type">字典类型</param>
        /// <param name="pType">父级字典类型</param>
        /// <param name="pCode">父级字典类型</param>
        /// <returns></returns>
        public ResponseData GetDicListByTypeAndPTypeAndPCODE(string type,string pType,string pCode)
        {
            var res = new ResponseData();
            try
            {
                res = _DictionaryService.GetDicListByTypeAndPTypeAndPCODE(type, pType, pCode);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }

            return res;
        }
        #endregion

        #region 通过字典类型查询字典列表并分页
        /// <summary>
        /// 通过字典类型获取字典列表并分页
        /// </summary>
        /// <param name="type">字典类型</param>
        /// <param name="pageReq">分页参数</param>
        /// <returns></returns>
        [HttpPost]
        public ResponseData GetDicListByType([FromForm] string type, [FromForm] PageReq pageReq)
        {
            var res = new ResponseData();
            try
            {
                res = _DictionaryService.GetDicListByType(type, pageReq);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region 字典信息保存
        /// <summary>
        /// 字典信息保存
        /// </summary>
        /// <param name="id">主键</param>
        /// <param name="data">表单数据</param>
        /// <returns></returns>
        [HttpPost]
        public ResponseData SaveDic([FromForm] int? id, [FromForm] ZCRDT_T_DIC dicModel)
        {
            var res = new ResponseData();
            try
            {
                _DictionaryService.SaveDic(id, dicModel);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region 通过Id删除字典
        /// <summary>
        /// 通过Id删除字典
        /// </summary>
        /// <param name="id">主键</param>
        /// <returns></returns>
        [HttpDelete]
        public ResponseData DeleteDicById(int id)
        {
            var res = new ResponseData();
            try
            {
                _DictionaryService.DeleteDicById(id);
            }
            catch (Exception ex)
            {
                res.Code = 400;
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
        public ResponseData GetSalesAdminByBukrs(string SPRAS, string BUKRS,List<string> SalesAdmin)
        {
            var res = new ResponseData();
            try
            {
                res = _DictionaryService.GetSalesAdminByBukrs(SPRAS, BUKRS, SalesAdmin);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region 通过语言类型、公司编码、销售管理员查询CreditManager数据源
        /// <summary>
        /// 通过语言类型、公司编码、销售管理员查询CreditManager数据源
        /// </summary>
        /// <param name="SPRAS">语言类型</param>
        /// <param name="BUKRS">公司编码</param>
        /// <param name="SalesAdmin">销售管理员</param>
        /// <returns></returns>
        public ResponseData GetCRManagerListByBukrsAndSalesAdmin(string SPRAS, string BUKRS, string SalesAdmin)
        {
            var res = new ResponseData();
            try
            {
                res = _DictionaryService.GetCRManagerListByBukrsAndSalesAdmin(SPRAS, BUKRS, SalesAdmin);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region 通过语言类型和字段名称查询C&V数据源
        /// <summary>
        /// 通过语言类型和字段名称查询C&V数据源
        /// </summary>
        /// <param name="SPRAS">语言类型</param>
        /// <param name="CoreId">字段名称</param>
        /// <returns></returns>
        public ResponseData GetCodeAndValueListByCoreId(string SPRAS, string CoreId)
        {
            var res = new ResponseData();
            try
            {
                res = _DictionaryService.GetCodeAndValueListByCoreId(SPRAS, CoreId);
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
