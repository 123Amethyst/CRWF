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
    public class DictionaryService: BaseController
    {
        private TestContext _context;
        protected string CultureLanguages;
        public DictionaryService(IStringLocalizer<HomeController> localizer, IUnitWork unitWork) : base(localizer, unitWork)
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

        #region 获取字典类型
        /// <summary>
        /// 获取字典类型
        /// </summary>
        /// <returns></returns>
        public ResponseData GetDicType()
        {
            var res = new ResponseData();
            var query = UnitWork.Find<ZCRDT_T_DIC>().Select(x => x.DTYPE);
            var data = query.AsQueryable().Distinct();
            res.Data = data;
            return res;
        }
        #endregion

        #region 通过字典类型获取字典列表
        /// <summary>
        /// 通过字典类型获取字典列表
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public ResponseData GetDicListByType(string type)
        {
            var res = new ResponseData();
            var query = UnitWork.Find<ZCRDT_T_DIC>(x => x.DTYPE == type);
            var data = query.AsQueryable().ToList();
            res.Data = data;
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
        public ResponseData GetDicListByTypeAndPTypeAndPCODE(string type, string pType, string pCode) 
        {
            var res = new ResponseData();
            var query = UnitWork.Find<ZCRDT_T_DIC>(x => x.DTYPE.Equals(type)&&x.PTYPE.Equals(pType)&&x.PCODE.Equals(pCode));
            var data = query.AsQueryable().ToList();
            res.Data = data;
            return res;
        }
        #endregion

        #region 通过字典类型获取字典列表并分页
        /// <summary>
        /// 通过字典类型获取字典列表并分页
        /// </summary>
        /// <param name="type">字典类型</param>
        /// <param name="pageReq">分页参数</param>
        /// <returns></returns>
        public ResponseData GetDicListByType(string type, PageReq pageReq)
        {
            var res = new ResponseData();
            var query = UnitWork.Find<ZCRDT_T_DIC>(x => x.DTYPE == type);
            query = query.AsQueryable().Where(pageReq);
            var data = query.AsQueryable().Paging(pageReq).ToList();
            res.Data = data;
            res.Count = query.Count();
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
        public void SaveDic(int? id, ZCRDT_T_DIC dicModel)
        {
            var dictionary = UnitWork.FindSingle<ZCRDT_T_DIC>(u => u.ID.Equals(id));
            if (dictionary != null)
            {
                dicModel.AEDAT = DateTime.Now;
                dicModel.AENAM = dicModel.AENAM;
                UnitWork.Update(dicModel);
            }
            else
            {
                dicModel.ERDAT = DateTime.Now;
                UnitWork.Add(dicModel);
            }
            UnitWork.Save();
        }
        #endregion

        #region 字典信息删除
        /// <summary>
        /// 字典信息删除
        /// </summary>
        /// <param name="dicModel">要删除的列表数据</param>
        public void DeleteDicById(int id)
        {
            var dictionary = UnitWork.FindSingle<ZCRDT_T_DIC>(u => u.ID.Equals(id));
            if (dictionary != null)
            {
                UnitWork.Delete<ZCRDT_T_DIC>(u => u.ID.Equals(id));
                UnitWork.Save();
            }
        }
        #endregion

        #region 通过语言类型和公司编码查询SalesAdmin数据源
        /// <summary>
        /// 通过语言类型和公司编码查询SalesAdmin数据源
        /// </summary>
        /// <param name="SPRAS">语言类型</param>
        /// <param name="BUKRS">公司编码</param>
        /// <param name="SalesAdmin">SalesAdmin类型</param>
        /// <returns></returns>
        public ResponseData GetSalesAdminByBukrs(string SPRAS, string BUKRS,List<string> SalesAdmin)
        {
            var res = new ResponseData();
            var salesAdminList = new List<SalesAdmin>();
            var query = UnitWork.Find<SalesAdmin>(x => x.SPRAS.Equals(SPRAS) && x.BUKRS.Equals(BUKRS));
            var data = query.AsQueryable().ToList();
            if (data != null && data.Count > 0)
            {
                for (int i = 0; i < SalesAdmin.Count; i++)
                {
                    for (int j = 0; j < data.Count; j++)
                    {
                        if (SalesAdmin[i]== data[j].ZZSALESADMIN) 
                        {
                            salesAdminList.Add(data[j]);
                        }
                    }
                }
            }
            res.Data = salesAdminList;
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
        public ResponseData GetCRManagerListByBukrsAndSalesAdmin(string SPRAS, string BUKRS,string SalesAdmin)
        {
            var res = new ResponseData();
            var query = UnitWork.Find<CreditManager>(x => x.SPRAS.Equals(SPRAS) && x.BUKRS.Equals(BUKRS)&&x.ZZSALESADMIN.Equals(SalesAdmin));
            var data = query.AsQueryable().ToList();
            res.Data = data;
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
            var query = UnitWork.Find<CVNormal>(x => x.SPRAS.Equals(SPRAS) && x.CORE_ID.Equals(CoreId));
            var data = query.AsQueryable().ToList();
            res.Data = data;
            return res;
        }
        #endregion

    }
}
