using CRDT.WF.Data;
using CRDT.WF.Interface;
using CRDT.WF.Model;
using CRDT.WF.Response;
using CRDT.WF.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace CRDT.WF.Controllers
{
    public class ApprovalFlowController : BaseController
    {
        private ApprovalFlowService _ApprovalFlowService;
        protected const string CRDTSystemId = "5";
        public ApprovalFlowController(IStringLocalizer<HomeController> localizer, IUnitWork unitWork) : base(localizer, unitWork)
        {
            _ApprovalFlowService = new ApprovalFlowService(localizer, unitWork);
        }
        public ResponseData GetUserDDList([FromForm] string[] bukrs, string userType, [FromForm] PageReq pageReq)
        {
            var res = new ResponseData();
            try
            {
                List<User> users = new List<User>();
                List<UserInfo> Users = new List<UserInfo>();
                var userList = _ApprovalFlowService.GetUserList();
                if (userList.Code == 200)
                {
                    users = userList.Data;
                    users = users.Where(u => u.IsActive).ToList();
                    if (bukrs != null&& bukrs.Length>0)
                    {
                        if (userType == "SubmitUser")
                        {
                            users = users.Where(u =>
                            {
                                bool isDoubleCompany = false;                                
                                var item = u.UserAttributes.FindAll(x => x.FieldName.Equals("Company"));
                                if (item != null && item.Count > 0)
                                {
                                    for (int i = 0; i < bukrs.Length; i++)
                                    {
                                        for (int j = 0; j < item.Count; j++)
                                        {
                                            if (item[j].FieldValue.Equals(bukrs[i]))
                                            {
                                                isDoubleCompany = true;
                                            }
                                        }
                                    }
                                }
                                return isDoubleCompany;
                            }).ToList();
                        }
                        else if (userType == "ApplicantUser")
                        {
                            users = users.Where(u =>
                            {
                                bool isDoubleCompany = false;
                                var item = u.UserAttributes.FindAll(x => x.FieldName.Equals("Company"));
                                if (item != null && item.Count > 0)
                                {
                                    for (int i = 0; i < bukrs.Length; i++)
                                    {
                                        for (int j = 0; j < item.Count; j++)
                                        {
                                            if (item[j].FieldValue.Equals(bukrs[i]))
                                            {
                                                isDoubleCompany = true;
                                            }
                                        }
                                    }
                                }
                                return isDoubleCompany;
                            }).ToList();
                            users = users.Where(u =>
                            {
                                bool isApplicant = false;
                                var item = u.UserAttributes.FindAll(x => x.FieldName.Equals("RoleCode"));
                                if (item != null && item.Count > 0)
                                {
                                    for (int i = 0; i < item.Count; i++)
                                    {
                                        if (item[i].FieldValue.Equals("Applicant") || item[i].FieldValue.Equals("Clerk"))
                                        {
                                            isApplicant = true;
                                        }
                                    }
                                }
                                return isApplicant;

                            }).ToList();
                        }
                    }
                    //else
                    //{
                    //    if (userType == "ApplicantUser")
                    //    {
                    //        users = users.Where(u =>
                    //        {
                    //            bool isApplicant = false;
                    //            var item = u.UserAttributes.FindAll(x => x.FieldName.Equals("RoleCode"));
                    //            if (item != null && item.Count > 0)
                    //            {
                    //                for (int i = 0; i < item.Count; i++)
                    //                {
                    //                    if (item[i].FieldValue.Equals("Applicant") || item[i].FieldValue.Equals("Clerk"))
                    //                    {
                    //                        isApplicant = true;
                    //                    }
                    //                }
                    //            }
                    //            return isApplicant;

                    //        }).ToList();
                    //    }
                    //}
                }
                
                if (pageReq.Filters != null)
                {
                    pageReq.Filters.ForEach(u =>
                    {
                        if (u.Field.Equals("AccountName"))
                            u.Field = "DisplayName";
                    });
                }
                users = users.AsQueryable().Where(pageReq).ToList();
                List<User> data = users.AsQueryable().Paging(pageReq).ToList();
                foreach (var item in data)
                {
                    var currentUser = new UserInfo()
                    {
                        UserId = item.UserId,
                        Account = item.Account,
                        AccountName = item.DisplayName
                    };
                    _ApprovalFlowService.GetUserProperty(item.UserAttributes, ref currentUser);
                    Users.Add(currentUser);
                }
                res.Data = Users;
                res.Count = users.Count;
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        // 获取附件列表
        public ResponseData GetApproFileList([FromForm] string requestId, [FromForm] Token token)
        {
            ResponseData res = new ResponseData();
            try
            {
                AutoMapping(_ApprovalFlowService.GetApproFileList(requestId, token), res);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }

        // 获取审批记录
        public ResponseData GetApproHisList([FromForm] string requestId, [FromForm] Token token)
        {
            ResponseData res = new ResponseData();
            try
            {
                AutoMapping(_ApprovalFlowService.GetApproHisList(requestId, token), res);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }


        // 保存附件
        public ResponseData SaveAttachment()
        {
            ResponseData res = new ResponseData();
            try
            {
                var files = HttpContext.Request.Form.Files;
                if (files.Count > 0)
                {
                    res.Data = _ApprovalFlowService.SaveAttachment(files[0]);
                }
                else
                {
                    res.Code = 400;
                }
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }

        // 下载附件
        public FileResult DownloadApproFile([FromForm] string fileStr)
        {
            string BasePath = Directory.GetCurrentDirectory();
            ApproFile file = Newtonsoft.Json.JsonConvert.DeserializeObject<ApproFile>(fileStr);
            //var contentType = MimeMapping.GetMimeMapping(file);
            string contentType;
            if (!System.IO.File.Exists(BasePath + file.FilePath))
                throw new Exception("File does not exist");
            new FileExtensionContentTypeProvider().TryGetContentType(BasePath + file.FilePath, out contentType);
            var stream = System.IO.File.OpenRead(BasePath + file.FilePath);
            return File(stream, contentType ?? "application/octet-stream", file.FileDesc + Path.GetExtension(file.FilePath));
        }

        // 获取其他资料列表
        public ResponseData attList([FromForm] string sDate, [FromForm] string eDate, [FromForm] string useid, [FromForm] string fileType, [FromForm] PageReq pageReq)
        {
            ResponseData res = new ResponseData();
            try
            {
                fileType = "";
                List<ApproFileUser> list = _ApprovalFlowService.aptUserList(sDate, eDate, useid, fileType);

                foreach (ApproFileUser ua in list)
                {
                    if (ua.FileType == "VAT")
                    {
                        ua.FileType = "发票图片";
                    }
                    else
                    {
                        ua.FileType = "附件";
                    }
                }

                list = list.AsQueryable().Where(pageReq).ToList();
                var data = list.AsQueryable().Paging(pageReq).ToList();
                res.Data = data;
                res.Count = list.Count;
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }

        #region 获取SAP未返回数据
        /// <summary>
        /// 获取SAP未返回数据
        /// </summary>
        /// <param name="KUNNR">Bp编号</param>
        /// <param name="BUKRS">公司编码</param>
        /// <returns></returns>
        public ResponseData GetSAPNotReturnData(string KUNNR, string BUKRS)
        {
            var res = new ResponseData();
            try
            {
                var cache = _ApprovalFlowService.GetCacheDetail(KUNNR, BUKRS);
                if (cache != null)
                {
                    res.Data = cache;
                }
                else
                {
                    res.Data = null;
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

        /// <summary>
        /// 通过厂房Code、部门Code、申请大类Code查询流程编码
        /// </summary>
        /// <param name="company">厂房Code</param>
        /// <param name="dept">部门Code</param>
        /// <param name="refc">申请大类Code</param>
        /// <param name="token">token</param>
        /// <returns></returns>
        [HttpPost]
        public ResponseData GetFlowCode([FromForm] string company, [FromForm] string dept, [FromForm] string refc, [FromForm] Token token) 
        {
            var res = new ResponseData();
            try
            {
                //获取FlowCode
                var flowCode = _ApprovalFlowService.GetFlowCode(company, dept, refc, token);
                res.Data = flowCode;
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        // 提交/审批表单数据
        [HttpPost]
        public ResponseData SubmitForm([FromForm] ApproSubmit ApproSubmit, [FromForm] ApproSubmitRequestData RequestData,[FromForm] ZCRDT_T_WFHD HD, [FromForm] ZCRDT_T_WFPI Payer, [FromForm] ZCRDT_T_WFAR AR, [FromForm] ZCRDT_T_WFBR BR, List<ApproFile> AddFileList, List<ApproFile> DelFileList, CustomerCreditReq CustomerCredit, Token token)
        {
            var res = new ResponseData();
            var isEnd = false;
            var payer = "";
            var Kunnr = "";
            //随机生成RequestId
            if (HD.REQID == null || HD.REQID == "")
            {
                ApproSubmit.RequestId = "CRDT" + DateTime.Now.ToString("yyyyMMdd") + _ApprovalFlowService.GetRequestId("RequestId");
            }
            else
            {
                ApproSubmit.RequestId = HD.REQID;
            }
            try
            {
                if (ApproSubmit.ApproType == "DRAFT")
                {
                    HD.ACTCD = "DRAFT";
                    HD.ACTNM = "草稿";
                }
                else
                {
                    if (string.IsNullOrEmpty(ApproSubmit.FlowCode))
                    {
                        throw new Exception("ymsg.ApproveWorkFlowCheck");
                    }
                    //判断下一节点是否是END
                    var stageCode = _ApprovalFlowService.GetNextStage(ApproSubmit.RequestId,ApproSubmit.FlowCode, ApproSubmit.StageCode, RequestData.TOTAL_AMT,token);
                    if (stageCode=="END"&& (ApproSubmit.ApproType== "APPROVE"|| ApproSubmit.ApproType == "SUBMIT")) 
                    {
                        var bPNo = Payer.KUNNR;

                        if (HD.APPTYPE == "CRDT01")
                        {
                            var getPayerNoReq = new GetPayerNoReq();
                            getPayerNoReq.IV_BPTYPE = "1";
                            getPayerNoReq.IV_ZNUM = ApproSubmit.RequestId;
                            getPayerNoReq.IV_ZSOURCE = "HD";
                            payer = _ApprovalFlowService.GetPayerNumber(getPayerNoReq);
                            CustomerCredit.I_PARTNER = payer;
                        }
                        else if (HD.APPTYPE == "CRDT05")
                        {
                            payer = Payer.BILL_TO;
                        }
                        CustomerCredit.I_ZNUM = ApproSubmit.RequestId;
                        CustomerCredit.I_LIMIT_VALID_DATE = AR.VALID_TO == null ? "" : AR.VALID_TO?.ToString("yyyy-MM-dd");
                        //更新BP Info和CreditMaster 到SAP
                        var changeCustomerDataReq = _ApprovalFlowService.GetChangeCustomerData(false, payer, CustomerCredit.I_ZNUM, CustomerCredit.I_BUKRS, HD, Payer, AR, BR,token);
                        var customerCreateOrUpdate = _ApprovalFlowService.ChangeCustomerDataAndCredit(changeCustomerDataReq, CustomerCredit, HD.APPTYPE);
                        if (customerCreateOrUpdate.Code == 200)
                        {
                            if (HD.APPTYPE != "CRDT03"&& HD.APPTYPE != "CRDT04") 
                            {
                                var cacheModel = new ZCRDT_T_CACHE();
                                if (HD.APPTYPE == "CRDT01" || HD.APPTYPE == "CRDT05")
                                {
                                    cacheModel.KUNNR = payer;
                                    if (HD.APPTYPE == "CRDT05") 
                                    {
                                        var cache = _ApprovalFlowService.GetCacheDetail(cacheModel.KUNNR, CustomerCredit.I_BUKRS);
                                        cacheModel = cache == null?cacheModel: cache;
                                    }
                                    cacheModel.CUST_STATUS = AR.CUST_STATUS;
                                    cacheModel.MNRF = AR.MNRF;
                                    cacheModel.SEC_DEPOSIT = AR.SEC_DEPOSIT;
                                    cacheModel.SEC_DEPOSIT_SCORE = AR.SEC_DEPOSIT_SCORE;
                                }
                                else
                                {
                                    cacheModel.KUNNR = Payer.KUNNR;
                                    var cache = _ApprovalFlowService.GetCacheDetail(cacheModel.KUNNR, CustomerCredit.I_BUKRS);
                                    cacheModel = cache == null ? cacheModel : cache;
                                    cacheModel.SEC_DEPOSIT = AR.SEC_DEPOSIT;
                                    cacheModel.CUST_STATUS = cacheModel.CUST_STATUS==null?"": cacheModel.CUST_STATUS;
                                }
                                cacheModel.BUKRS = CustomerCredit.I_BUKRS;
                                cacheModel.SECURITY = AR.SECURITY;
                                cacheModel.DEPOSIT_REF_NO = AR.DEPOSIT_REF_NO;
                                cacheModel.PAYER_NO = AR.PAYER_NO;
                                cacheModel.PHONE1_EXT = Payer.PHONE1_EXT;
                                cacheModel.PHONE2_EXT = Payer.PHONE2_EXT;
                                cacheModel.REMARK = Payer.REMARK;
                                _ApprovalFlowService.SaveCache(cacheModel);
                            }
                            if (HD.APPTYPE == "CRDT01" || HD.APPTYPE == "CRDT05")
                            {
                                var getCustomerDataReq = new GetCustomerDataReq();
                                getCustomerDataReq.I_ZNUM = ApproSubmit.RequestId;
                                getCustomerDataReq.I_BUKRS = CustomerCredit.I_BUKRS;
                                getCustomerDataReq.I_ZSOURCE = "HD";
                                getCustomerDataReq.I_DATAB = "20220101";
                                getCustomerDataReq.I_TIMAB = "000000";
                                getCustomerDataReq.I_DATBI = DateTime.Now.ToString("yyyyMMdd hhmmss").Split(' ')[0];
                                getCustomerDataReq.I_TIMBI = DateTime.Now.ToString("yyyyMMdd hhmmss").Split(' ')[1];
                                getCustomerDataReq.I_SAP = "";
                                if (Payer.INPUT_OPTION == "Single") 
                                {
                                    #region outlet是否存在在SAP中
                                    var isExistInSAP = false;
                                    getCustomerDataReq.I_PARTNER = bPNo;
                                    var query = _ApprovalFlowService.GetCustomer(getCustomerDataReq);
                                    if (query.Code == 200)
                                    {
                                        isExistInSAP = true;
                                    }
                                    else 
                                    {
                                        var messages = query.Data.ET_MESSAGE;
                                        if (messages != null && messages.Count > 0)
                                        {
                                            var message = messages[0];
                                            if (message.ZMSGID == "316")
                                            {
                                                var cmwfData = _ApprovalFlowService.CMWFDataAPI(bPNo, 2).Data;
                                                if (cmwfData != null)
                                                {
                                                    isExistInSAP = false;
                                                }
                                                else 
                                                {
                                                    throw new Exception("ymsg.BPInvalidError");
                                                }
                                            }
                                        }
                                    }
                                    
                                    #endregion

                                    if (isExistInSAP)
                                    {
                                        //修改Partner Function(Payer和Bill-to字段)
                                        CustomerCredit.I_ZNUM = ApproSubmit.RequestId;
                                        var changeCustomerData = _ApprovalFlowService.GetChangeCustomerData(true, payer, CustomerCredit.I_ZNUM, CustomerCredit.I_BUKRS, HD, Payer, AR, BR,token);
                                        _ApprovalFlowService.ChangeCustomerDataAndCredit(changeCustomerData, CustomerCredit, HD.APPTYPE);
                                    }
                                    else
                                    {
                                        var cmwfRes = _ApprovalFlowService.CMWFDataAPI(bPNo,1).Data;
                                        var changeCustomerData = _ApprovalFlowService.GetChangeCustomerData(true, payer, CustomerCredit.I_ZNUM, CustomerCredit.I_BUKRS, HD, Payer, AR, BR, token);
                                        if (cmwfRes!=null&& cmwfRes.flowStatus == "COMPLETE")
                                        {
                                            var effectiveDate = cmwfRes.effectiveDate;
                                            var updateOutletPartnerReq = new UpdateOutletPartnerJobReq();
                                            var jobReq = new JobRequestData();
                                            jobReq.EffectiveDate = Convert.ToDateTime(effectiveDate);
                                            jobReq.Data = changeCustomerData;
                                            updateOutletPartnerReq.CreateUser = RequestData.ApproverName;
                                            updateOutletPartnerReq.RequestId = ApproSubmit.RequestId;
                                            updateOutletPartnerReq.ClassName = "ChangeCustomerJob";
                                            var jobJson = JsonConvert.SerializeObject(jobReq);
                                            updateOutletPartnerReq.RequestData = jobJson;
                                            _ApprovalFlowService.UpdateOutletPartnerByJob(updateOutletPartnerReq);
                                        }
                                        else
                                        {
                                            throw new Exception("ymsg.BPInvalidError");
                                        }
                                    }
                                }
                                else if (Payer.INPUT_OPTION == "Mass")
                                {
                                    if (!string.IsNullOrEmpty(Payer.UPLOAD_RESULT)) 
                                    {
                                        var outletArray=new List<string>();
                                        var outletStrs = Payer.UPLOAD_RESULT.Split(':')[1];
                                        if (outletStrs.IndexOf(',') != -1)
                                        {
                                            outletArray = outletStrs.Split(',').ToList();
                                        }
                                        else 
                                        {
                                            outletArray.Add(outletStrs);
                                        }
                                       
                                        if (outletArray!=null&& outletArray.Count>0) 
                                        {
                                            Kunnr = outletArray[0];
                                            for (int i = 0; i < outletArray.Count; i++)
                                            {
                                                #region outlet是否存在在SAP中
                                                var isExistInSAP = false;
                                                getCustomerDataReq.I_PARTNER = outletArray[i];
                                                var query = _ApprovalFlowService.GetCustomer(getCustomerDataReq);
                                                if (query.Code == 200)
                                                {
                                                    isExistInSAP = true;
                                                }
                                                else 
                                                {
                                                    var messages = query.Data.ET_MESSAGE;
                                                    if (messages != null && messages.Count > 0)
                                                    {
                                                        var message = messages[0];
                                                        if (message.ZMSGID == "316")
                                                        {
                                                            var cmwfData = _ApprovalFlowService.CMWFDataAPI(outletArray[i], 2).Data;
                                                            if (cmwfData != null)
                                                            {
                                                                isExistInSAP = false;
                                                            }
                                                            else
                                                            {
                                                                throw new Exception("ymsg.BPInvalidError");
                                                            }
                                                        }
                                                    }
                                                }
                                                #endregion

                                                if (isExistInSAP)
                                                {
                                                    //修改Partner Function(Payer和Bill-to字段)
                                                    CustomerCredit.I_ZNUM = ApproSubmit.RequestId;
                                                    Payer.KUNNR = outletArray[i];
                                                    var changeCustomerData = _ApprovalFlowService.GetChangeCustomerData(true, payer, CustomerCredit.I_ZNUM, CustomerCredit.I_BUKRS, HD, Payer, AR, BR,token);
                                                    _ApprovalFlowService.ChangeCustomerDataAndCredit(changeCustomerData, CustomerCredit, HD.APPTYPE);
                                                }
                                                else
                                                {
                                                    Payer.KUNNR = outletArray[i];
                                                    var cmwfRes = _ApprovalFlowService.CMWFDataAPI(outletArray[i],1).Data;
                                                    var changeCustomerData = _ApprovalFlowService.GetChangeCustomerData(true, payer, CustomerCredit.I_ZNUM, CustomerCredit.I_BUKRS, HD, Payer, AR, BR, token);
                                                    if (cmwfRes != null && cmwfRes.flowStatus == "COMPLETE")
                                                    {
                                                        var effectiveDate = cmwfRes.effectiveDate;
                                                        var updateOutletPartnerReq = new UpdateOutletPartnerJobReq();
                                                        var jobReq = new JobRequestData();
                                                        jobReq.EffectiveDate = Convert.ToDateTime(effectiveDate);
                                                        jobReq.Data = changeCustomerData;
                                                        updateOutletPartnerReq.CreateUser = RequestData.ApproverName;
                                                        updateOutletPartnerReq.RequestId = ApproSubmit.RequestId;
                                                        updateOutletPartnerReq.ClassName = "ChangeCustomerJob";
                                                        var jobJson = JsonConvert.SerializeObject(jobReq);
                                                        updateOutletPartnerReq.RequestData = jobJson;
                                                        _ApprovalFlowService.UpdateOutletPartnerByJob(updateOutletPartnerReq);
                                                    }
                                                    else
                                                    {
                                                        throw new Exception("ymsg.BPInvalidError");
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ApproSubmit.RequestData = RequestData;
                    var json = JsonConvert.SerializeObject(ApproSubmit);
                    var aprRes = _ApprovalFlowService.SubmitApprove(ApproSubmit, token);
                    if (aprRes.Code == 200)
                    {
                        if (aprRes.Data.StageCode=="END") 
                        {
                            isEnd = true;
                        }
                        //保存审批记录
                        _ApprovalFlowService.SaveCRDTTASK(HD, ApproSubmit, aprRes.Data);

                        HD.ACTCD = aprRes.Data.StageCode;
                        HD.ACTNM = aprRes.Data.StageName;
                    }
                }
                if (isEnd && HD.APPTYPE=="CRDT01")
                {
                    //Payer.KUNNR = payer;
                    Payer.BILL_TO = payer;
                }
                if (isEnd &&Payer.INPUT_OPTION=="Mass"&&(HD.APPTYPE == "CRDT01"|| HD.APPTYPE == "CRDT05")) 
                {
                    Payer.KUNNR = Kunnr;
                }
                //保存表单数据信息
                _ApprovalFlowService.SaveCRDTWFHD(ApproSubmit.RequestId, HD);
                _ApprovalFlowService.SaveCRDTWFPI(ApproSubmit.RequestId, Payer);
                _ApprovalFlowService.SaveCRDTWFAR(ApproSubmit.RequestId, AR);
                _ApprovalFlowService.SaveCRDTWFBR(ApproSubmit.RequestId, BR);

                //同步附件数据
                _ApprovalFlowService.BatchAddAttachment(ApproSubmit.RequestId, ApproSubmit.FlowCode, ApproSubmit.ApproUserId, AddFileList, token);
                _ApprovalFlowService.BatchDeleteAttachment(DelFileList, token);

                res.Data = HD.REQID;
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        #region ToDoList
        //获取任务列表
        public ResponseData GetTaskList([FromForm] TaskInfo TaskInfo, [FromForm] PageReq pageReq, [FromForm] Token token)
        {
            ResponseData res = new ResponseData();
            try
            {
                TaskInfo.ModuleId = CRDTSystemId;
                AutoMapping(_ApprovalFlowService.GetTaskList(TaskInfo, pageReq, token), res);
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        //获取我的草稿
        public ResponseData GetDraftList([FromForm] TaskInfo TaskInfo, [FromForm] PageReq pageReq)
        {
            ResponseData res = new ResponseData();
            try
            {
                res = _ApprovalFlowService.GetDraftList(TaskInfo.Account, pageReq);
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        //获取表单数据
        public ResponseData GetApproForm([FromForm] string RequestId)
        {
            ResponseData res = new ResponseData();
            try
            {
                FormData d = new FormData();
                d.HD = _ApprovalFlowService.GetCRDTWFHDDetail(RequestId);
                d.Payer = _ApprovalFlowService.GetCRDTWFPIDetail(RequestId);
                d.AR = _ApprovalFlowService.GetCRDTWFARDetail(RequestId);
                d.BR = _ApprovalFlowService.GetCRDTWFBRDetail(RequestId);
                res.Data = d;
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        // 获取多个用户信息
        public ResponseData GetUsersInfo([FromForm] List<string> accounts,[FromForm] Token token)
        {
            ResponseData res = new ResponseData();
            try
            {
                List<UserInfo> users = new List<UserInfo>();
                var userids = new List<long>();
                var query = _ApprovalFlowService.GetUserList();
                if (query.Data.Count>0) 
                {
                    foreach (var item2 in accounts)
                    {
                        foreach (var item1 in query.Data)
                        {
                            if (item1.Account == item2) 
                            {
                                userids.Add(item1.UserId);
                            }
                        }
                    }
                }
                userids.ForEach(u =>
                {
                    var query = _ApprovalFlowService.GetUserInfo(u, token);
                    if (query.Data != null)
                    {
                        UserInfo currentUser = new UserInfo()
                        {
                            UserId = query.Data.UserId,
                            Account = query.Data.Account,
                            AccountName = query.Data.DisplayName
                        };
                        _ApprovalFlowService.GetUserProperty(query.Data.UserAttributes, ref currentUser);
                        users.Add(currentUser);
                    }
                });
                res.Count = users.Count;
                res.Data = users;
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        //获取筛选数据
        public ResponseData GetFiltersData()
        {
            ResponseData res = new ResponseData();
            try
            {
                List<ListItem> d = new List<ListItem>();
                var plantType = "PLANT";
                var appType = "APPTYPE";
                d.Add(new ListItem()
                {
                    Name = "PLANT_NAME_Select",
                    Value = _ApprovalFlowService.GetDicListByType(plantType)
                });
                d.Add(new ListItem()
                {
                    Name = "ACTION_NAME_Select",
                    Value = _ApprovalFlowService.GetDicListByType(appType)
                });
                res.Data = d;
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        /// <summary>
        /// 客戶信用主檔同步接口_HK
        /// </summary>
        /// <param name="req">请求参数</param>
        /// <param name="token">token</param>
        /// <returns></returns>
        public ResponseData GetCustomerCredit(GetCustomerCreditReq req)
        {
            var res = new ResponseData();
            var creditData = new List<LT_RETURN>();
            try
            {
                var data = _ApprovalFlowService.GetCustomerCredit(req);
                if (data.Code!=200) 
                {
                    throw new Exception(data.Message);
                }
                var credit = JsonConvert.DeserializeObject<List<LT_RETURN>>(data.Data.E_JSON);
                if (credit != null)
                {
                    creditData = credit;
                }
                else 
                {
                    var defaultCredit = new LT_RETURN();
                    defaultCredit.CHECK_RULE = "ZX";
                    defaultCredit.RISK_CLASS = "B";
                    defaultCredit.VALID_DATE = "9999-12-31";
                    defaultCredit.CREDIT_LIMIT = "0";
                    creditData.Add(defaultCredit);
                }
                res.Data = creditData;
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        /// <summary>
        /// 获取客户数据
        /// </summary>
        /// <param name="BpNo">BP编号</param>
        /// <param name="BUKRS">公司编码</param>
        /// <returns></returns>
        public ResponseData GetCustomerData(string BpNo,string BUKRS) 
        {
            var res = new ResponseData();
            try
            {
                var customerData = _ApprovalFlowService.GetCustomerData(BpNo, BUKRS);
                res.Data = customerData;
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        public ResponseData GetCustomerDataByApi(GetCustomerDataReq req) 
        {
            var res = new ResponseData();
            try
            {
                var customerData = _ApprovalFlowService.GetCustomerData(req);
                if (customerData.Code != 200)
                {
                    throw new Exception(customerData.Message);
                }
                var data = customerData.Data.ET_CUST_ITEM;
                if (data!=null&& data.Count>0) 
                {
                    res.Data = data[0];
                }
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        public ResponseData GetCustomerDataByApiOrCMWF(GetCustomerDataReq req)
        {
            var res = new ResponseData();
            try
            {
                var customerData = _ApprovalFlowService.GetCustomer(req);
                if (customerData.Code == 200)
                {
                    var data = customerData.Data.ET_CUST_ITEM;
                    if (data != null && data.Count > 0)
                    {
                        res.Data = data[0];
                        res.Message ="SAP";
                    }
                }
                else 
                {
                    var messages = customerData.Data.ET_MESSAGE;
                    if (messages != null && messages.Count > 0)
                    {
                        var message = messages[0];
                        if (message.ZMSGID == "316")
                        {
                            res.Data = _ApprovalFlowService.CMWFDataAPI(req.I_PARTNER, 2).Data;
                            res.Message = "CMWF";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        public bool GetCheckBpNoResult(GetCustomerDataReq req) 
        {
            var isValid = false;
            var customerData = _ApprovalFlowService.GetCustomer(req);
            if (customerData.Code != 200)
            {
                var messages = customerData.Data.ET_MESSAGE;
                if (messages != null && messages.Count > 0)
                {
                    var message = messages[0];
                    if (message.ZMSGID == "316")
                    {
                        var cmwfData = _ApprovalFlowService.CMWFDataAPI(req.I_PARTNER, 1);
                        if (cmwfData.Data.flowStatus == "COMPLETE")
                        {
                            isValid = true;
                        }
                    }
                }
            }
            else
            {
                isValid = true;
            }
           
            return isValid;
        }

        public ResponseData GetCMWFData(string bpNo) 
        {
            var res = new ResponseData();
            try
            {
                res = _ApprovalFlowService.CMWFDataAPI(bpNo, 2);
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        /// <summary>
        /// 检验Payer的状态(开放 Or 关闭)
        /// </summary>
        /// <param name="req">请求参数</param>
        /// <param name="token"></param>
        /// <returns></returns>
        public ResponseData OutletCloseCheck(OutletCloseCheckReq req) 
        {
            var res=new ResponseData();
            try
            {
                var query = _ApprovalFlowService.OutletCloseCheck(req);
                if (query.Code!=200) 
                {
                    throw new Exception(query.Message);
                }
                res.Data = query.Data.ET_DATA[0];
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        //获取代理人列表
        public ResponseData GetDelegationList([FromForm] long userid, [FromForm] Token token)
        {
            ResponseData res = new ResponseData();
            try
            {
                AutoMapping(_ApprovalFlowService.GetDelegationList(userid, token), res);
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        //编辑代理人
        public ResponseData SaveDelegation([FromForm] Delegation info, [FromForm] Token token)
        {
            ResponseData res = new ResponseData();
            try
            {
                if (info.AgentId == 0)
                {
                    DelegationAdd add = new DelegationAdd();
                    AutoMapping(info, add);
                    res = _ApprovalFlowService.AddDelegation(add, token);
                }
                else
                {
                    DelegationChange change = new DelegationChange();
                    AutoMapping(info, change);
                    res = _ApprovalFlowService.EditDelegation(change, token);
                }
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }

        //删除代理人
        public ResponseData DeleteDelegation([FromForm] long AgentId, [FromForm] Token token)
        {
            ResponseData res = new ResponseData();
            try
            {
                res = _ApprovalFlowService.DeleteDelegation(AgentId, token);
            }
            catch (Exception ex)
            {
                res.Code = 500;
                res.Message = ex.Message;
            }
            return res;
        }
    }
}
