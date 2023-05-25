using CRDT.WF.Data;
using CRDT.WF.Model;
using CRDT.WF.Response;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CRDT.WF.Controllers;
using Microsoft.Extensions.Localization;
using CRDT.WF.Interface;
using Ui5.Data;
using Microsoft.AspNetCore.Http;
using System.IO;
using CRDT.WF.Infrastructure;
using Newtonsoft.Json;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;

namespace CRDT.WF.Service
{
    public class ApprovalFlowService : BaseController
    {
        private TestContext _context;
        private const int CRDTSystemId= 5;
        protected string CultureLanguages;
        protected const string UploadFilePath = "/Uploads/";
        public ApprovalFlowService(IStringLocalizer<HomeController> localizer, IUnitWork unitWork) : base(localizer, unitWork)
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

        #region 用户基本信息
        /// <summary>
        /// 登录验证 
        /// </summary>
        /// <returns></returns>
        public APIResponseData<User> UserAuthenticate(string userName, string password, Token token)
        {
            var dic = new Authen { ModuleId = CRDTSystemId, Account = userName, Passwd = password };
            return PostAsync<APIResponseData<User>, Authen>("api/Authen", dic, token);
        }

        public APIResponseData<List<User>> GetUserList()
        {
            return GetAsync<APIResponseData<List<User>>>("api/User/" + CRDTSystemId);
        }

        /// <summary>
        /// 获取人员信息
        /// </summary>
        /// <returns></returns>
        public APIResponseData<User> GetUserInfo(long UserId, Token token)
        {
            return GetAsync<APIResponseData<User>>("api/User?module=" + CRDTSystemId + "&user=" + UserId, token);
        }
        /// <summary>
        /// 用户信息 归纳
        /// </summary>
        /// <returns></returns>
        public UserInfo GetUserProperty(List<UserProperty> UserProperties, ref UserInfo currentUser)
        {
            foreach (UserProperty up in UserProperties)
            {
                switch (up.FieldName)
                {
                    case "Account":
                        currentUser.Account = up.FieldValue;
                        currentUser.AccountName = up.FieldValueDesc;
                        break;
                    case "Company":
                        currentUser.Company.Add(up.FieldValue);
                        currentUser.CompanyName.Add(up.FieldValueDesc);
                        break;
                    case "CostCenter":
                        currentUser.CostCenter = up.FieldValue;
                        currentUser.CostCenterName = up.FieldValueDesc;
                        break;
                    case "Tel":
                        currentUser.Tel = up.FieldValue;
                        break;
                    case "Email":
                        currentUser.Email = up.FieldValue;
                        break;
                    case "Department":
                        currentUser.Department = up.FieldValue;
                        currentUser.DepartmentName = up.FieldValueDesc;
                        break;
                    case "Position":
                        currentUser.PositionName = up.FieldValue;
                        break;
                    case "EmpCode":
                        currentUser.EmpCode = up.FieldValue;
                        break;
                    case "Leader":
                        currentUser.Leader = up.FieldValue;
                        currentUser.LeadName = up.FieldValueDesc;
                        break;
                    case "Vendor":
                        currentUser.Vendor = up.FieldValue;
                        break;
                    case "Level":
                        currentUser.Level = up.FieldValue;
                        break;
                    case "ProfitCenter":
                        currentUser.ProfitCenter = up.FieldValue;
                        currentUser.ProfitCenterName = up.FieldValueDesc;
                        break;
                    case "LeaderCompany":
                        currentUser.LeaderCompany = up.FieldValue;
                        currentUser.LeaderCompanyName = up.FieldValueDesc;
                        break;
                    case "WorkCompany":
                        currentUser.WorkCompany = up.FieldValue;
                        currentUser.WorkCompanyName = up.FieldValueDesc;
                        break;
                    case "Gender":
                        currentUser.Gender = up.FieldValue;
                        break;
                    case "RoleCode":
                        currentUser.RoleId.Add(up.FieldValue);
                        break;
                    case "SalesAdmin":
                        currentUser.SalesAdmin.Add(up.FieldValue);
                        break;
                    case "SalesRegion":
                        currentUser.SalesRegion = up.FieldValue;
                        break;
                    default: break;
                }
            }
            return currentUser;
        }
        /// <summary>
        /// 获取token
        /// </summary>
        /// <returns></returns>
        public Token GetToken()
        {
            return PostAsync<Token>("OAuth/Token");
        }
        #endregion

        /// <summary>
        /// 获取菜单 
        /// </summary>
        /// <returns></returns>
        public APIResponseData<List<Menu>> GetMenu(int UserId)
        {
            var result= GetAsync<APIResponseData<List<Menu>>>("api/Authen?user=" + UserId + "&parid=" + CRDTSystemId);
            if (result.Code != 200)
            { 
                throw new Exception(result.Message);
            }
            else
            {
                if (result.Data != null && result.Data.Count > 0)
                {
                    for (int i = 0; i < result.Data.Count; i++)
                    {
                        if (result.Data[i].ModuleDesc == "Menu_Common_Dictionary")
                        {
                            result.Data[i].Children = GetDicType(result.Data[i].ModuleId);
                        }
                        else if (result.Data[i].Children != null && result.Data[i].Children.Count > 0)
                        {
                            ChildrenList(result.Data[i].Children);
                        }
                    }
                }
            }
            return result;
        }
        public List<Menu> ChildrenList(List<Menu> menuList) 
        {
            for (int i = 0; i < menuList.Count; i++)
            {
                if (menuList[i].ModuleDesc == "Menu_Common_Dictionary")
                {
                    menuList[i].Children = GetDicType(menuList[i].ModuleId);
                }
                else if(menuList[i].Children!=null&& menuList[i].Children.Count>0)
                {
                    ChildrenList(menuList[i].Children);
                }
            }
            return menuList;
        }
        public List<Menu> GetDicType(long parModuleId)
        {
            var list = new List<Menu>();
            var dictype = from dic in UnitWork.Find<ZCRDT_T_DIC>()
                          select dic;
            
            if (dictype!=null&&dictype.Count() > 0)
            {
                var moduleId = 0;
                foreach (var item in dictype.Select(e => e.DTYPE).ToList().Distinct())
                {
                    var child = new Menu();
                    child.Checked = false;
                    child.ImgUrl = "";
                    child.IsActive = true;
                    child.IsClosed = false;
                    child.ModuleCode = "CRDT0201";
                    child.ModuleDesc = "Menu_Common" + "_"+ item;
                    child.ModuleId = moduleId++;
                    child.ModuleName = item;
                    child.ModulePath = "Page_Common" + "_" + "Dictionary";
                    child.ParModuleId = parModuleId;
                    child.Step = 1;
                    list.Add(child);
                }
            }
            return list;
        }

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
            else if (type=="Dept") 
            {
                var query = UnitWork.Find<SerNum>(u => u.DateString.Equals("820005")).OrderByDescending<SerNum, int>(x => x.Num).FirstOrDefault();
                if (query!=null) 
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

        /// <summary>
        /// 根据Id查询CRDTAR详情
        /// </summary>
        /// <param name="requestId">主键Id</param>
        /// <returns></returns>
        public dynamic GetCRDTWFARDetail(string requestId)
        {
            var arInfo =UnitWork.FindSingle<ZCRDT_T_WFAR>(x=>x.REQID == requestId);
            return arInfo;
        }
        /// <summary>
        /// 保存CRDTWFAR表单数据
        /// </summary>
        /// <param name="reqId">请求Id</param>
        /// <param name="CRDTARModel">表单ARInformation数据</param>
        public void SaveCRDTWFAR(string reqId, ZCRDT_T_WFAR CRDTARModel)
        {
            if (CRDTARModel.REQID != null)
            {
                UnitWork.Update(CRDTARModel);
            }
            else 
            {
                CRDTARModel.REQID = reqId;
                UnitWork.Add(CRDTARModel);
            }
            UnitWork.Save();
        }
        /// <summary>
        /// 根据Id查询CRDTWFBR详情
        /// </summary>
        /// <param name="requestId">主键Id</param>
        /// <returns></returns>
        public dynamic GetCRDTWFBRDetail(string requestId)
        {
            var brInfo = UnitWork.FindSingle<ZCRDT_T_WFBR>(x => x.REQID == requestId);
            return brInfo;
        }
        /// <summary>
        /// 保存CRDTWFBR表单数据
        /// </summary>
        /// <param name="reqId">请求Id</param>
        /// <param name="CRDTBRModel">表单BRInformation数据</param>
        public void SaveCRDTWFBR(string reqId, ZCRDT_T_WFBR CRDTBRModel)
        {
            if (CRDTBRModel.REQID != null)
            {
                UnitWork.Update(CRDTBRModel);
            }
            else
            {
                CRDTBRModel.REQID = reqId;
                UnitWork.Add(CRDTBRModel);
            }
            UnitWork.Save();
        }
        /// <summary>
        /// 根据Id查询CRDTWFPI详情
        /// </summary>
        /// <param name="requestId">主键Id</param>
        /// <returns></returns>
        public dynamic GetCRDTWFPIDetail(string requestId)
        {
            var payerInfo = UnitWork.FindSingle<ZCRDT_T_WFPI>(x => x.REQID == requestId);
            return payerInfo;
        }
        /// <summary>
        /// 保存CRDTWFPI表单数据
        /// </summary>
        /// <param name="reqId">请求Id</param>
        /// <param name="CRDTPIModel">表单PIInformation数据</param>
        public void SaveCRDTWFPI(string reqId, ZCRDT_T_WFPI CRDTPIModel)
        {
            if (CRDTPIModel.REQID != null)
            {
                UnitWork.Update(CRDTPIModel);
            }
            else
            {
                CRDTPIModel.REQID = reqId;
                UnitWork.Add(CRDTPIModel);
            }
            UnitWork.Save();
        }
        /// <summary>
        /// 保存Sap未返回字段
        /// </summary>
        /// <param name="CacheModel"></param>
        public void SaveCache(ZCRDT_T_CACHE CacheModel)
        {
            var cache = UnitWork.FindSingle<ZCRDT_T_CACHE>(x => x.KUNNR.Equals(CacheModel.KUNNR)&&x.BUKRS.Equals(CacheModel.BUKRS));
            if (cache != null)
            {
                UnitWork.Update(CacheModel);
            }
            else
            {
                UnitWork.Add(CacheModel);
            }
            UnitWork.Save();
        }
        public ZCRDT_T_CACHE GetCacheDetail(string KUNNR,string BUKRS) 
        {
            return UnitWork.FindSingle<ZCRDT_T_CACHE>(x => x.KUNNR.Equals(KUNNR) && x.BUKRS.Equals(BUKRS));
        }
        /// <summary>
        /// 根据Id查询CRDTWFHD详情
        /// </summary>
        /// <param name="requestId">主键Id</param>
        /// <returns></returns>
        public dynamic GetCRDTWFHDDetail(string requestId)
        {
            var hdInfo = UnitWork.FindSingle<ZCRDT_T_WFHD>(x => x.REQID == requestId);
            return hdInfo;
        }
        /// <summary>
        /// 保存CRDTWFHD表单数据
        /// </summary>
        /// <param name="reqId">请求Id</param>
        /// <param name="CRDTHDModel">表单HD数据</param>
        public void SaveCRDTWFHD(string reqId, ZCRDT_T_WFHD CRDTHDModel)
        {
            if (CRDTHDModel.REQID != null)
            {
                CRDTHDModel.AEDAT = DateTime.Now;
                UnitWork.Update(CRDTHDModel);
            }
            else
            {
                CRDTHDModel.REQID = reqId;
                CRDTHDModel.ERDAT = DateTime.Now;
                UnitWork.Add(CRDTHDModel);
            }
            UnitWork.Save();
        }

        /// <summary>
        /// 保存CRDTTask数据
        /// </summary>
        /// <param name="reqId">请求Id</param>
        /// <param name="CRDTTaskModel">Task数据</param>
        public void SaveCRDTTASK(ZCRDT_T_WFHD HD, ApproSubmit ApproSubmit, ApproSubmitRes res)
        {
            UnitWork.Update<ZCRDT_T_TASK>(u => u.RequestId.Equals(ApproSubmit.RequestId)
                                       && u.StageCode.Equals(HD.ACTCD)
                                       && u.UserId.Equals(ApproSubmit.ApproUserId), u => new ZCRDT_T_TASK
                                       {
                                           PassFlag = true,
                                           AgentUserId = ApproSubmit.AgentUserId,
                                           UpdateDate = DateTime.Now
                                       });
            UnitWork.Delete<ZCRDT_T_TASK>(u => u.RequestId.Equals(ApproSubmit.RequestId)
                                        && u.StageCode.Equals(res.StageCode));
            UnitWork.Save();
            res.UserList.ForEach(u =>
                {
                    UnitWork.Add(new ZCRDT_T_TASK
                    {
                        RequestId = ApproSubmit.RequestId,
                        StageCode = res.StageCode,
                        UserId = u.UserId,
                        Account = u.Account,
                        UserName = u.UserName,
                        StageName = res.StageName,
                        PassFlag = false,
                        CreateDate = DateTime.Now,
                        AgentUserId = null,
                        UpdateDate = null
                    });
                });
            UnitWork.Save();
        }
        /// <summary>
        /// 获取流程编码
        /// </summary>
        /// <param name="company">厂房</param>
        /// <param name="dept">部门</param>
        /// <param name="refc">申请大类code</param>
        /// <param name="token"></param>
        /// <returns></returns>
        public string GetFlowCode(string company,string dept,string refc, Token token) 
        {
            var flowCode="";
            var data =  GetAsync<ResponseData>("api/FlowRef/?module=" + CRDTSystemId+"&company="+ company+ "&dept="+ dept+ "&refc="+ refc, token);
            if (data.Code != 200) 
            {
                throw new Exception(data.Message);
            }
            else
            {
                flowCode = data.Message;
            }
            return flowCode;
        }
        
        /// <summary>
        /// 获取下一个节点
        /// </summary>
        /// <param name="flowCode">流程编号</param>
        /// <param name="currentStage">当前节点</param>
        /// <param name="amt">审批金额</param>
        /// <param name="token">token</param>
        /// <returns></returns>
        public string GetNextStage(string reqId,string flowCode, string currentStage, decimal amt, Token token)
        {
            var stageCode = "";
            var data = GetAsync<ResponseData>("api/Approve/?reqid="+ reqId +"&flow=" + flowCode + "&stage=" + currentStage + "&amt=" + amt, token);
            if (data.Code != 200)
            {
                throw new Exception(data.Message);
            }
            else
            {
                var stage = JsonConvert.DeserializeObject<Stage>(Convert.ToString(data.Data));
                if (stage!=null) 
                {
                    stageCode = stage.StageCode;
                }
            }
            return stageCode;
        }

        /// <summary>
        /// 提交审批
        /// </summary>
        /// <returns></returns>
        public APIResponseData<ApproSubmitRes> SubmitApprove(ApproSubmit info, Token token)
        {
            var res = PostAsync<APIResponseData<ApproSubmitRes>, ApproSubmit>("api/Approve", info, token);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }
        /// <summary>
        /// BP outbound interface
        /// </summary>
        /// <param name="req">请求参数</param>
        /// <param name="token">token</param>
        /// <returns></returns>
        public APIResponseData<GetCustomerDataRes> GetCustomerData(GetCustomerDataReq req) 
        {
            var res = PostAsyncRfc<APIResponseData<GetCustomerDataRes>, GetCustomerDataReq>("ZOTC_GETCUSTOMERDATA", req);
            if (res.Code != 200)
            {
                if (res.Data.ET_MESSAGE != null && res.Data.ET_MESSAGE.Count > 0)
                {
                    res.Message = res.Data.ET_MESSAGE[0].ZMSGTXT;
                }
                throw new Exception(res.Message);
            }
            return res;
        }

        public APIResponseData<GetCustomerDataRes> GetCustomer(GetCustomerDataReq req)
        {
            var res = PostAsyncRfc<APIResponseData<GetCustomerDataRes>, GetCustomerDataReq>("ZOTC_GETCUSTOMERDATA", req);           
            return res;
        }

        /// <summary>
        /// 客戶信用主檔同步接口_HK
        /// </summary>
        /// <param name="req">请求参数</param>
        /// <param name="token">token</param>
        /// <returns></returns>
        public APIResponseData<GetCustomerCreditRes> GetCustomerCredit(GetCustomerCreditReq req)
        {
            var res = PostAsyncRfc<APIResponseData<GetCustomerCreditRes>, GetCustomerCreditReq>("ZRTR_FM_GETCUSTOMERCREDIT", req);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }

        /// <summary>
        /// 客戶信用主檔異動接口_HK
        /// </summary>
        /// <param name="req">请求参数</param>
        /// <param name="token">token</param>
        /// <returns></returns>
        public APIResponseData<CustomerCreditRes> CustomerCredit(CustomerCreditReq req)
        {
            var res = PostAsyncRfc<APIResponseData<CustomerCreditRes>, CustomerCreditReq>("ZRTR_FM_CUSTOMERCREDIT", req);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }

        public ChangeCustomerDataReq GetChangeCustomerData(bool isUpdatePartner,string payer,string ZNUM, string BUKRS, ZCRDT_T_WFHD HD, ZCRDT_T_WFPI Payer, ZCRDT_T_WFAR AR, ZCRDT_T_WFBR BR,Token token) 
        {
            var custChangeData = new IT_CUST_CHANGE_DATA();
            var custChangeDataList = new List<IT_CUST_CHANGE_DATA>();
            var custChangeDataX = new IT_CUST_CHANGE_DATA_X();
            var custChangeDataXList = new List<IT_CUST_CHANGE_DATA_X>();
            var custVisitMasterData = new List<IT_CUST_VISITMASTER_DATA>();
            var changeCustomerDataReq = new ChangeCustomerDataReq();
            //var customerData = new Customer();
            changeCustomerDataReq.I_ZNUM = ZNUM;
            changeCustomerDataReq.I_ZSOURCE = "HD";
            changeCustomerDataReq.I_ZZMODIFYBY = HD.AENAM==null?HD.ERNAM: HD.AENAM;
            changeCustomerDataReq.I_TEST = "";
            if (!isUpdatePartner)
            {
                if (HD.APPTYPE == "CRDT01") 
                {
                    var getCustomerDataReq = new GetCustomerDataReq();
                    getCustomerDataReq.I_ZNUM = ZNUM;
                    getCustomerDataReq.I_BUKRS = BUKRS;
                    getCustomerDataReq.I_ZSOURCE = "HD";
                    getCustomerDataReq.I_DATAB = "20220101";
                    getCustomerDataReq.I_TIMAB = "000000";
                    getCustomerDataReq.I_DATBI = DateTime.Now.ToString("yyyyMMdd hhmmss").Split(' ')[0];
                    getCustomerDataReq.I_TIMBI = DateTime.Now.ToString("yyyyMMdd hhmmss").Split(' ')[1];
                    getCustomerDataReq.I_SAP = "";
                    getCustomerDataReq.I_PARTNER = Payer.KUNNR;
                    var query = GetCustomer(getCustomerDataReq);
                    if (query.Code == 200)
                    {
                        var data = query.Data.ET_CUST_ITEM;
                        if (data != null && data.Count > 0)
                        {
                            var customerData = data[0];
                            BaseController.CopyModel(custChangeData, customerData);
                        }
                    }
                    else
                    {
                        var messages = query.Data.ET_MESSAGE;
                        if (messages != null && messages.Count > 0)
                        {
                            var message = messages[0];
                            if (message.ZMSGID == "316")
                            {
                                var customerData = CMWFDataAPI(Payer.KUNNR,2).Data;
                                if (customerData != null)
                                {
                                    BaseController.CopyModel(custChangeData, customerData);
                                }
                                else 
                                {
                                    throw new Exception("ymsg.BPInvalidError");
                                }
                            }
                        }
                    }
                    //customerData = GetCustomerData(Payer.KUNNR, BUKRS);
                }
                if (HD.APPTYPE == "CRDT03"|| HD.APPTYPE == "CRDT04")
                {
                    custChangeData.KUNNR = Payer.KUNNR;
                    custChangeData.BUKRS = BUKRS;
                    custChangeData.ZPFLAG = "U";
                    custChangeData.PERRL = AR.PERRL;
                    custChangeData.ZTERM_KNVV = AR.CREDIT_TERM;
                    custChangeData.ZTERM_KNB1 = AR.CREDIT_TERM;
                    custChangeData.TYPE = "BUP002";
                    custChangeData.INSTITUTE = BR.INSTITUTE;
                    custChangeData.IDNUMBER = BR.IDNUMBER;
                    custChangeData.VALID_DATE_FROM = BR.VALID_DATE_FROM != null ? BR.VALID_DATE_FROM?.ToString("yyyy-MM-dd") : "";
                    custChangeData.VALID_DATE_TO = BR.VALID_DATE_TO != null ? BR.VALID_DATE_TO?.ToString("yyyy-MM-dd") : "";
                    if (HD.APPTYPE == "CRDT04")
                    {
                        custChangeData.ZZCLOSEDDATE = DateTime.Now.ToString("yyyyMMdd");
                        custChangeData.ZZCUSTSTATUS = "S";
                        custChangeData.ZZCLOSEDREASON = Payer.CLOSE_REASON;
                    }
                    if (HD.APPTYPE == "CRDT03") 
                    {
                        custChangeData.AKONT = AR.AKONT;
                        if (custChangeData.AKONT == "0115101450")
                        {
                            custChangeData.KTGRD = "04";//Intercompany Sales
                        }
                        else if (custChangeData.AKONT == "0115101200")
                        {
                            custChangeData.KTGRD = "01";//Sales Revenue
                        }
                        custChangeData.BU_BKVID = "VA";
                        custChangeData.BU_BANKS = "HK";
                        custChangeData.BU_BANKK = "004";
                        custChangeData.BU_BANKN = "502203466001";
                        custChangeData.BU_BKEXT = AR.BU_BKEXT;
                    }
                }
                else
                {
                    if (HD.APPTYPE == "CRDT01")
                    {
                        custChangeData.ZPFLAG = "A";
                        custChangeData.KUNNR = payer;
                        custChangeData.KATR1 = "B";
                        custChangeData.ZPAYER = payer;
                        custChangeData.ZBILLTO = payer;
                        custChangeData.ZSHIPTO = payer;
                        custChangeData.ZZCUSTSTATUS = "N";                        
                        //custChangeData.BU_BKVID = "VA";
                        //custChangeData.BU_BANKS = "HK";
                        //custChangeData.BU_BANKK = "004";
                        //custChangeData.BU_BANKN = "502203466001";
                        custChangeData.VISITMASTER = "";
                    }
                    else 
                    {
                        custChangeData.ZPFLAG = "U";

                        if (HD.APPTYPE == "CRDT05")
                        {
                            custChangeData.KUNNR = Payer.BILL_TO;
                            custChangeData.ZZCUSTSTATUS = "N";
                            custChangeData.ZZCLOSEDREASON = "";
                            custChangeData.ZZREOPENDATE = DateTime.Now.ToString("yyyyMMdd");
                        }
                        else 
                        {
                            custChangeData.KUNNR = Payer.KUNNR;
                        }
                    }
                    custChangeData.BUKRS = BUKRS;
                    custChangeData.BU_BKVID = "VA";
                    custChangeData.BU_BANKS = "HK";
                    custChangeData.BU_BANKK = "004";
                    custChangeData.BU_BANKN = "502203466001";
                    custChangeData.TYPE = "BUP002";
                    custChangeData.KATR2 = AR.BUSINESS_NATURE;
                    custChangeData.ZZRECONPRT = AR.RECONPRT;
                    custChangeData.ZZTURNKEY = AR.TURNKEY;
                    custChangeData.ZZSALESADMIN = Payer.SALESADMIN;
                    custChangeData.NAME_ORG1 = Payer.NAME_ORG1;
                    custChangeData.NAME_ORG2 = Payer.NAME_ORG2;
                    custChangeData.NAME1_SZF = Payer.NAME1_SZF;
                    custChangeData.NAME2_SZF = Payer.NAME2_SZF;
                    custChangeData.STREET_CEN = Payer.STREET_EN1;
                    custChangeData.STREET_CZF = Payer.STREET_CN1;
                    custChangeData.STR_SUPPL3_CEN = Payer.STREET_EN2;
                    custChangeData.STR_SUPPL3_CZF = Payer.STREET_CN2;
                    custChangeData.LOCATION_CEN = Payer.STREET_EN3;
                    custChangeData.LOCATION_CZF = Payer.STREET_CN3;
                    custChangeData.ZZCONTACTT11 = Payer.ATTENTION1;
                    custChangeData.ZZCONTACTP09 = Payer.ATTENTION2;
                    custChangeData.ZZCONTACTT09 = Payer.PHONE1;
                    custChangeData.ZZCONTACTT09B = Payer.PHONE2;
                    custChangeData.ZZFMAILADDR1 = Payer.EMAIL1;
                    custChangeData.ZZFMAILADDR2 = Payer.EMAIL2;
                    custChangeData.ZZFMAILADDR3 = Payer.EMAIL3;
                    custChangeData.FAX_NUMBER_CZF = Payer.FAX;
                    custChangeData.ZZCUSTORGTYPE = AR.CUST_TYPE;                   
                    custChangeData.ZTERM_KNVV = AR.CREDIT_TERM;
                    custChangeData.ZTERM_KNB1 = AR.CREDIT_TERM;
                    custChangeData.ZZBANKGUREXPDATE = AR.BANKGUR_EXPDATE!=null?AR.BANKGUR_EXPDATE?.ToString("yyyy-MM-dd"): "";
                    custChangeData.PERRL = AR.PERRL;
                    custChangeData.ZZCRMANAGER = AR.CRMANAGER;
                    custChangeData.AKONT = AR.AKONT;
                    custChangeData.BU_BKEXT = AR.BU_BKEXT;
                    if (custChangeData.AKONT == "0115101450")
                    {
                        custChangeData.KTGRD = "04";//Intercompany Sales
                    }
                    else if (custChangeData.AKONT == "0115101200")
                    {
                        custChangeData.KTGRD = "01";//Sales Revenue
                    }
                    custChangeData.INSTITUTE = BR.INSTITUTE;
                    custChangeData.IDNUMBER = BR.IDNUMBER;
                    custChangeData.VALID_DATE_FROM = BR.VALID_DATE_FROM!=null?BR.VALID_DATE_FROM?.ToString("yyyy-MM-dd"): "";
                    custChangeData.VALID_DATE_TO = BR.VALID_DATE_TO!=null?BR.VALID_DATE_TO?.ToString("yyyy-MM-dd"): "";
                }
                if (HD.APPTYPE != "CRDT01")
                {
                    custChangeDataX.KUNNR = Payer.KUNNR;
                    custChangeDataX.BUKRS = BUKRS;
                    if (HD.APPTYPE == "CRDT03" || HD.APPTYPE == "CRDT04")
                    {
                        custChangeDataX.PERRL = "X";
                        custChangeDataX.ZTERM_KNVV = "X";
                        custChangeDataX.ZTERM_KNB1 = "X";
                        custChangeDataX.TYPE = "X";
                        custChangeDataX.INSTITUTE = "X";
                        custChangeDataX.IDNUMBER = "X";
                        custChangeDataX.VALID_DATE_FROM = "X";
                        custChangeDataX.VALID_DATE_TO = "X";
                        if (HD.APPTYPE == "CRDT04")
                        {
                            custChangeDataX.ZZCUSTSTATUS = "X";
                            custChangeDataX.ZZCLOSEDREASON = "X";
                            custChangeDataX.ZZCLOSEDDATE = "X";
                        }
                        if (HD.APPTYPE == "CRDT03")
                        {
                            custChangeDataX.AKONT = "X";
                            custChangeDataX.KTGRD = "X";
                            custChangeDataX.BU_BKVID = "X";
                            custChangeDataX.BU_BANKS = "X";
                            custChangeDataX.BU_BANKK = "X";
                            custChangeDataX.BU_BANKN = "X";
                            custChangeDataX.BU_BKEXT = "X";
                        }
                    }
                    else
                    {
                        if (HD.APPTYPE == "CRDT05")
                        {
                            custChangeDataX.KUNNR = Payer.BILL_TO;
                            custChangeDataX.ZZCUSTSTATUS = "X";
                            custChangeDataX.ZZCLOSEDREASON = "X";
                            custChangeDataX.ZZREOPENDATE = "X";
                        }
                        custChangeDataX.BU_BKVID = "X";
                        custChangeDataX.BU_BANKS = "X";
                        custChangeDataX.BU_BANKK = "X";
                        custChangeDataX.BU_BANKN = "X";
                        custChangeDataX.TYPE = "X";
                        custChangeDataX.KATR2 = "X";
                        custChangeDataX.ZZRECONPRT = "X";
                        custChangeDataX.ZZTURNKEY ="X";
                        custChangeDataX.ZZSALESADMIN = "X";
                        custChangeDataX.NAME_ORG1 = "X";
                        custChangeDataX.NAME_ORG2 = "X";
                        custChangeDataX.NAME1_SZF = "X";
                        custChangeDataX.NAME2_SZF = "X";
                        custChangeDataX.STREET_CEN = "X";
                        custChangeDataX.STREET_CZF = "X";
                        custChangeDataX.STR_SUPPL3_CEN = "X";
                        custChangeDataX.STR_SUPPL3_CZF = "X";
                        custChangeDataX.LOCATION_CEN = "X";
                        custChangeDataX.LOCATION_CZF = "X";
                        custChangeDataX.ZZCONTACTT11 = "X";
                        custChangeDataX.ZZCONTACTP09 = "X";
                        custChangeDataX.ZZCONTACTT09 = "X";
                        custChangeDataX.ZZCONTACTT09B = "X";
                        custChangeDataX.ZZFMAILADDR1 = "X";
                        custChangeDataX.ZZFMAILADDR2 = "X";
                        custChangeDataX.ZZFMAILADDR3 = "X";
                        custChangeDataX.FAX_NUMBER_CZF = "X";
                        custChangeDataX.ZZCUSTORGTYPE = "X";
                        custChangeDataX.ZTERM_KNVV = "X";
                        custChangeDataX.ZTERM_KNB1 = "X";
                        custChangeDataX.ZZBANKGUREXPDATE = "X";
                        custChangeDataX.PERRL = "X";
                        custChangeDataX.ZZCRMANAGER = "X";
                        custChangeDataX.AKONT = "X";
                        custChangeDataX.BU_BKEXT = "X";
                        custChangeDataX.KTGRD = "X";
                        custChangeDataX.INSTITUTE = "X";
                        custChangeDataX.IDNUMBER = "X";
                        custChangeDataX.VALID_DATE_FROM = "X";
                        custChangeDataX.VALID_DATE_TO = "X";
                        custChangeDataX.AKONT = "X";
                    }
                    PropertyInfo[] properties = custChangeDataX.GetType().GetProperties();
                    foreach (PropertyInfo pi in properties)
                    {
                        if (pi.GetValue(custChangeDataX, null) == null)
                        {
                            pi.SetValue(custChangeDataX, "");
                        }
                    }
                    custChangeDataXList.Add(custChangeDataX);
                }
            }
            else 
            {
                custChangeData.KUNNR = Payer.KUNNR;
                custChangeData.BUKRS = BUKRS;
                custChangeData.ZPFLAG = "U";
                custChangeData.ZPAYER = payer;
                custChangeData.ZBILLTO = payer;
                custChangeDataX.KUNNR = Payer.KUNNR;
                custChangeDataX.BUKRS = BUKRS;
                custChangeDataX.ZPAYER = "X";
                custChangeDataX.ZBILLTO = "X";
                PropertyInfo[] properties = custChangeDataX.GetType().GetProperties();
                foreach (PropertyInfo pi in properties)
                {
                    if (pi.GetValue(custChangeDataX, null) == null)
                    {
                        pi.SetValue(custChangeDataX, "");
                    }
                }
                custChangeDataXList.Add(custChangeDataX);
            }
            custChangeDataList.Add(custChangeData);
            changeCustomerDataReq.IT_CUST_CHANGE_DATA = custChangeDataList;
            changeCustomerDataReq.IT_CUST_CHANGE_DATA_X = custChangeDataXList;
            changeCustomerDataReq.IT_CUST_VISITMASTER_DATA = custVisitMasterData;
            var json= JsonConvert.SerializeObject(changeCustomerDataReq);
            return changeCustomerDataReq;
        }

        /// <summary>
        /// Update BP Info
        /// </summary>
        /// <param name="changeCustomerDataReq">请求Model</param>
        /// <param name="token"></param>
        /// <returns></returns>
        public APIResponseData<List<ChangeCustomerDataRes>> ChangeCustomerDataAndCredit(ChangeCustomerDataReq changeCustomerDataReq, CustomerCreditReq customerCredit, string appType) 
        {
            var res = PostAsyncRfc<APIResponseData<List<ChangeCustomerDataRes>>, ChangeCustomerDataReq>("ZOTC_CHANGECUSTOMERDATA", changeCustomerDataReq);
            if (res.Code != 200)
            {
              throw new Exception(res.Message);
            }
            if (appType == "CRDT04")
            {
                customerCredit.I_LIMIT_VALID_DATE = DateTime.Now.ToString("yyyy-MM-dd");
                customerCredit.I_CREDIT_LIMIT = "0";
                customerCredit.I_CHECK_RULE = "ZX";
            }
            CustomerCredit(customerCredit);
            return res;
        }

        /// <summary>
        /// 获取PayerNo
        /// </summary>
        /// <param name="req">请求参数</param>
        /// <returns></returns>
        public string GetPayerNumber(GetPayerNoReq req) 
        {
            var payerNo = "";
            var res = PostAsyncRfc<APIResponseData<GetPayerNoRes>, GetPayerNoReq>("ZRTR_GET_NEXT_PAYER_NUM", req);
            if (res.Code!=200) 
            {
                throw new Exception(res.Message);
            }
            payerNo = res.Data.EV_BPARTNER;
            return payerNo;
        }

        public void UpdateKUNNR(string reqId,string payer) 
        {
            var payerInfo = UnitWork.FindSingle<ZCRDT_T_WFPI>(x => x.REQID.Equals(reqId));
            if (payerInfo!=null) 
            {
                payerInfo.KUNNR = payer;
                payerInfo.BILL_TO = payer;
                UnitWork.Update(payerInfo);
                UnitWork.Save();
            }
        }

        /// <summary>
        /// Outlet Workflow API
        /// </summary>
        /// <param name="bpNo">outlet</param>
        /// <returns></returns>
        public ResponseData CMWFDataAPI(string bpNo,int type)
        {
            var res = new ResponseData();
            if (type==1) 
            {
                res.Data = GetAsyncCMWF<CMWFApiRes>("core/api/external/cmwf/creditwf/wfCmwfOutletInfo?businessPartner=" + bpNo);
                if (res.Data.flowStatus == "400")
                {
                    throw new Exception("ymsg.CMWFSystemLinkFail");
                }
            }
            if (type==2)
            {
                var result= GetAsyncCMWF<CMWFApiRes>("core/api/external/cmwf/creditwf/wfCmwfOutletInfo?businessPartner=" + bpNo);
                if (result.flowStatus == "COMPLETE")
                {
                    res.Data = GetAsyncCMWF<Customer>("core/api/external/cmwf/creditwf/wfCmwfOutletInfo?businessPartner=" + bpNo);
                } 
                else if (result.flowStatus == "400") 
                {
                    throw new Exception("ymsg.CMWFSystemLinkFail");               
                }
            }
            return res;
        }

        /// <summary>
        /// outlet超过有效期，job更新Partner function(payer、billto)
        /// </summary>
        /// <param name="req">请求参数</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public ResponseData UpdateOutletPartnerByJob(UpdateOutletPartnerJobReq req) 
        {
            var res = PostAsync<ResponseData, UpdateOutletPartnerJobReq>("api/JobData", req);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取客户数据
        /// </summary>
        /// <param name="BpNo">BP编号</param>
        /// <param name="BUKRS">公司编号</param>
        /// <returns></returns>
        public Customer GetCustomerData(string BpNo,string BUKRS) 
        {
            return UnitWork.FindSingle<Customer>(x => x.KUNNR.Equals(BpNo)&&x.BUKRS.Equals(BUKRS));
        }

        /// <summary>
        /// 检验Payer是否有效（打开 OR 关闭）
        /// </summary>
        /// <param name="req">请求参数</param>
        /// <param name="token"></param>
        /// <returns></returns>
        public APIResponseData<OutletCloseCheckRes> OutletCloseCheck(OutletCloseCheckReq req) 
        {
            var res = PostAsyncRfc<APIResponseData<OutletCloseCheckRes>, OutletCloseCheckReq>("ZOTC_OUTLET_CLOSE_CHECK", req);
            if (res.Code!=200) 
            {
                throw new Exception(res.Message);
            }
            return res;
        }

        /// <summary>
        /// 获取附件列表
        /// </summary>
        /// <returns></returns>
        public APIResponseData<List<ApproFile>> GetApproFileList(string RequestId, Token token)
        {
            return GetAsync<APIResponseData<List<ApproFile>>>("api/File/" + RequestId, token);
        }

        /// <summary>
        /// 获取审批记录
        /// </summary>
        /// <returns></returns>
        public APIResponseData<List<ApproHis>> GetApproHisList(string RequestId, Token token)
        {
            return GetAsync<APIResponseData<List<ApproHis>>>("api/ApproHis/" + RequestId, token);
        }

        /// <summary>
        /// 保存附件
        /// </summary>
        /// <returns></returns>
        public ApproFile SaveAttachment(IFormFile file)
        {
            string FileName = new Snowflake(1).nextId().ToString();
            string FileDesc = Path.GetFileNameWithoutExtension(file.FileName);//Regex.Replace(file.FileName, "(.*)[.].*", "$1");
            string FileType = Path.GetExtension(file.FileName);//Regex.Replace(file.FileName, ".*[.](.*)", "$1");
            string BasePath = Directory.GetCurrentDirectory();
            string FoldPath = UploadFilePath + DateTime.Now.ToString("yyMMdd") + "/";
            string FilePath = FileName + FileType;
            ApproFile dic = new ApproFile
            {
                FileName = FileName,
                FileDesc = FileDesc,
                FilePath = FoldPath + FilePath
            };
            //如果没有此文件夹，则新建
            if (!Directory.Exists(BasePath + UploadFilePath))
                Directory.CreateDirectory(BasePath + UploadFilePath);
            if (!Directory.Exists(BasePath + FoldPath))
                Directory.CreateDirectory(BasePath + FoldPath);
            //创建文件，返回一个 FileStream，它提供对 path 中指定的文件的读/写访问。
            using (FileStream fs = new FileStream(BasePath + FoldPath + FilePath, FileMode.Create))//System.IO.File.Create(filefullPath)
            {
                file.CopyTo(fs);
                fs.Flush();
            }
            return dic;
        }

        /// <summary>
        /// 其他资料列表
        /// </summary>
        /// <returns></returns>
        public List<ApproFileUser> aptUserList(string sDate, string eDate, string useid, string fileType)
        {
            fileType = "";
            List<ApproFileUser> list = UnitWork.Find<ApproFileUser>(_context, u => u.ApproUser.Equals(useid)
                                                                         && (u.FileType.Equals(fileType) || fileType.Equals(string.Empty)))
                .OrderByDescending(u => u.ApproDate).ToList();

            return list;
        }
        /// <summary>
        /// 获取任务列表
        /// </summary>
        /// <returns></returns>
        public dynamic GetTaskList(TaskInfo dis, PageReq pageReq, Token token)
        {
            var res = PostAsync<APIResponseData<List<TaskListRes>>, TaskInfo>("api/Task/", dis, token);
            if (res.Code == 200)
            {
                var query = from t in res.Data
                    join h in UnitWork.Find<ZCRDT_T_WFHD>(u => (dis.Category == "0" && u.ACTCD != "DRAFT") || dis.Category != "0")
                        on t.RequestId equals h.REQID into t_join
                    from tj in t_join.DefaultIfEmpty()
                    where tj != null
                    orderby tj.AEDAT==null?tj.ERDAT:tj.AEDAT descending
                    select new
                    {
                        tj.REQID,
                        tj.PLANT,
                        tj.ACTCD,
                        tj.ACTNM,
                        tj.PLANT_NAME,
                        tj.APPTYPE,
                        tj.ACTION,
                        CLAIM_USER = tj.USRID,
                        CLAIM_USER_NAME = tj.USRNM,
                        APPRO_USER = t.Account,
                        APPRO_USER_LIST=t.UserList,
                        CREATOR = tj.ERNAM,
                        CREATOR_NAME = tj.ERTXT,
                        tj.ERDAT,
                        UPDATE_DATE_TIME = Convert.ToDateTime(t.UpdateDate)
                    };
                query = query.AsQueryable().Where(pageReq);
                var data = query.AsQueryable().Paging(pageReq).ToList();
                return new ResponseData()
                {
                    Data = data,
                    Count = query.Count()
                };
            }
            return res;
        }
        /// <summary>
        /// 获取我的草稿
        /// </summary>
        /// <returns></returns>
        public ResponseData GetDraftList(string account, PageReq pageReq)
        {
            ResponseData res = new ResponseData();
            var query = from h in UnitWork.Find<ZCRDT_T_WFHD>(u => u.ERNAM.Equals(account)
                         && u.ACTCD.Equals("DRAFT"))
                        where h != null
                        orderby h.ERDAT descending
                        select new
                        {
                            h.REQID,
                            h.PLANT,
                            h.PLANT_NAME,
                            h.ACTCD,
                            CLAIM_USER = h.USRID,
                            CLAIM_USER_NAME = h.USRNM,
                            h.APPTYPE,
                            h.ACTION,
                            CREATOR = h.ERNAM,
                            CREATOR_NAME = h.ERTXT,
                            h.ERDAT
                        };
            query = query.AsQueryable().Where(pageReq);
            var data = query.AsQueryable().Paging(pageReq).ToList();
            res.Data = data;
            res.Count = query.Count();
            return res;
        }
        /// <summary>
        /// 批量新增附件
        /// </summary>
        /// <returns></returns>
        public void BatchAddAttachment(string RequestId, string flowCode, long approUserId, List<ApproFile> dic, Token token)
        {
            ResponseData res = new ResponseData();
            dic.ForEach(u =>
            {
                u.RequestId = RequestId;
                u.FlowCode = flowCode != null ? flowCode : "";
                u.ApproUserId = approUserId;
                //u.FileName = RequestId + new Snowflake(1).nextId();
                var temp = PostAsync<ResponseData, ApproFile>("api/File", u, token);
                if (temp.Code != 200)
                {
                    res.Code = 400;
                    res.Message += u.FileDesc + ":" + temp.Message + ";";
                }
            });
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
        }
        /// <summary>
        /// 批量删除附件
        /// </summary>
        /// <returns></returns>
        public void BatchDeleteAttachment(List<ApproFile> dic, Token token)
        {
            ResponseData res = new ResponseData();
            dic.ForEach(u =>
            {
                var temp = DeleteAsync<ResponseData, ApproFile>("api/File", u, token);
                if (temp.Code != 200)
                {
                    res.Code = 400;
                    res.Message += u.FileDesc + ":" + temp.Message + ";";
                }
            });
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
        }
        /// <summary>
        /// 获取字典下拉值(待办列表搜索条件)
        /// </summary>
        /// <returns></returns>
        public List<DDLField> GetDicListByType(string type) 
        {
            var res = from c in UnitWork.Find<ZCRDT_T_DIC>(u => u.DTYPE.Equals(type))
                      select new DDLField
                      {
                          id = c.DCODE,
                          text = c.DNAME
                      };
            return res.ToList();
        }

        /// <summary>
        /// 获取代理人列表
        /// </summary>
        /// <returns></returns>
        public APIResponseData<List<DelegationListRes>> GetDelegationList(long userid, Token token)
        {
            var res = GetAsync<APIResponseData<List<DelegationListRes>>>("api/Agent/" + userid, token);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }
        /// <summary>
        /// 新增代理人列表
        /// </summary>
        /// <returns></returns>
        public ResponseData AddDelegation(DelegationAdd info, Token token)
        {
            var res = PostAsync<ResponseData, DelegationAdd>("api/Agent", info, token);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }

        /// <summary>
        /// 修改代理人列表
        /// </summary>
        /// <returns></returns>
        public ResponseData EditDelegation(DelegationChange info, Token token)
        {
            var res = PutAsync<ResponseData, DelegationChange>("api/Agent/" + info.AgentId, info, token);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }

        /// <summary>
        /// 删除代理人列表
        /// </summary>
        /// <returns></returns>
        public ResponseData DeleteDelegation(long AgentId, Token token)
        {
            var res = DeleteAsync<ResponseData>("api/Agent/" + AgentId, token);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }
        /// <summary>
        /// 获取人员属性
        /// </summary>
        /// <returns></returns>
        public APIResponseData<List<UserProperty>> GetUserProp(string user, string account, string field)
        {
            var res = GetAsync<APIResponseData<List<UserProperty>>>("api/UserProp?module=" + CRDTSystemId + "&user=" + user + "&account=" + account + "&field=" + field);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }

        /// <summary>
        /// 发送邮件
        /// </summary>
        /// <returns></returns>
        public APIResponseData<string> SendEmail(AddPasswdLog info)
        {
            info.ModuleId = CRDTSystemId.ToString();
            return PostAsync<APIResponseData<string>, AddPasswdLog>("api/PasswdLog", info);
        }

        /// <summary>
        /// 获取密码重置信息
        /// </summary>
        /// <returns></returns>
        public APIResponseData<PasswdLogRes> GetPasswdLog(string id)
        {
            return GetAsync<APIResponseData<PasswdLogRes>>("api/PasswdLog/" + id);
        }

        /// <summary>
        /// 更新密码重置信息
        /// </summary>
        /// <returns></returns>
        public ResponseData UpdataPasswdLog(PasswdLog info)
        {
            return PutAsync<ResponseData, PasswdLog>("api/PasswdLog/1", info);
        }

        /// <summary>
        /// 修改密码 
        /// </summary>
        /// <returns></returns>
        public ResponseData ChangePassword(ChangePasswordInfo info)
        {
            var res = PostAsync<ResponseData, ChangePasswordInfo>("api/Passwd", info);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }

        /// <summary>
        /// 重置密码 
        /// </summary>
        /// <returns></returns>
        public ResponseData ResetPassword(ChangePasswordInfo info)
        {
            var res = PutAsync<ResponseData, ChangePasswordInfo>("api/Passwd/1", info);
            if (res.Code != 200)
            {
                throw new Exception(res.Message);
            }
            return res;
        }
    }
}
