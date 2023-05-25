using CRDT.WF.Infrastructure;
using CRDT.WF.Interface;
using CRDT.WF.Model;
using CRDT.WF.Response;
using CRDT.WF.Service;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace CRDT.WF.Controllers
{
    public class HomeController : BaseController
    {
        private ApprovalFlowService _ApprovalFlowService;
        public HomeController(IStringLocalizer<HomeController> localizer, IUnitWork unitWork) : base(localizer, unitWork)
        {
            _ApprovalFlowService = new ApprovalFlowService(localizer, unitWork);
        }
        [CustomAllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }
        //[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public IActionResult Index([FromForm] string data="\"\"")
        {
            string cookieKey = "";
            HttpContext.Request.Cookies.TryGetValue("CurrentUser", out cookieKey);
            string str = cookieKey != null ? HttpContext.Session.GetString(cookieKey) : null;
            if (str != null)
            {
                ViewBag.CurrentUser = str;
            }
            ViewBag.data = data;
            return View();
        }
        [HttpPost]
        [CustomAllowAnonymous]
        public IActionResult Login([FromForm] string userName, [FromForm] string password, [FromForm] Token token)
        {
            var res = new ResponseData();
            var query = new APIResponseData<User>();
            query = _ApprovalFlowService.UserAuthenticate(userName, password, token);
            if (query.Code == 200)
            {
                Guid sessionKey = Guid.NewGuid();
                UserInfo currentUser = new UserInfo()
                {
                    UserId = query.Data.UserId,
                    Account = query.Data.Account,
                    AccountName = query.Data.DisplayName
                };
                _ApprovalFlowService.GetUserProperty(query.Data.UserAttributes, ref currentUser);
                HttpContext.Response.Cookies.Append("CurrentUser", sessionKey.ToString(), new CookieOptions()
                {
                    Expires = DateTime.Now.AddMinutes(600)
                });
                HttpContext.Session.SetString(sessionKey.ToString(), JsonConvert.SerializeObject(currentUser));
                res.Message = Localizer["Success_Login"];
                res.Data = "/Home/Index";
            }
            else
            {
                res.Code = 400;
                res.Message = query.Message;
            }
            return Json(res);
        }
        // 获取token
        [HttpPost]
        [CustomAllowAnonymous]
        public ResponseData GetToken([FromForm] string userName, [FromForm] string password)
        {
            ResponseData res = new ResponseData();
            try
            {
                var _token = _ApprovalFlowService.GetToken();
                if (_token.access_token != string.Empty)
                {
                    if (_token.expires_in != null && _token.expires_in != "")
                    {
                        _token.expires_in = GetTime(DateTime.Now.AddSeconds(double.Parse(_token.expires_in))).ToString();
                    }
                }
                res.Data = _token;
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }

        // 获取菜单
        [HttpPost]
        public ResponseData GetMenu([FromForm] int user)
        {
            ResponseData res = new ResponseData();
            try
            {
                AutoMapping(_ApprovalFlowService.GetMenu(user), res);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }

        // 获取账号邮箱
        [CustomAllowAnonymous]
        [HttpPost]
        public ResponseData GetEmail([FromForm] string account)
        {
            ResponseData res = new ResponseData();
            try
            {
                AutoMapping(_ApprovalFlowService.GetUserProp("0", account, "Email"), res);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }

        // 发送重置密码邮件
        [CustomAllowAnonymous]
        [HttpPost]
        public ResponseData SendEmail([FromForm] AddPasswdLog info)
        {
            ResponseData res = new ResponseData();
            try
            {
                AutoMapping(_ApprovalFlowService.SendEmail(info), res);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
        // 更新密码
        [CustomAllowAnonymous]
        [Route("Home/UpdatePassword/{Id}")]
        public ActionResult UpdatePassword([FromRoute] string Id)
        {
            ResponseData res = new ResponseData();
            try
            {
                AutoMapping(_ApprovalFlowService.GetPasswdLog(Id), res);
                if (res.Data == null)
                    throw new Exception("该链接不存在");
                else if (res.Data.Status == "1")
                    throw new Exception("该链接已失效");
                ViewBag.Data = JsonConvert.SerializeObject(res.Data);
                _ApprovalFlowService.UpdataPasswdLog(new PasswdLog
                {
                    NewId = res.Data.NewId,
                    UpdateUserId = res.Data.UserId,
                    UpdateIP = ""
                });
                return View();
            }
            catch (Exception ex)
            {
                TempData["Message"] = ex.Message;
                return RedirectToAction("Index", "Error");
            }
        }

        // 修改密码
        [CustomAllowAnonymous]
        public ResponseData ChangePassword([FromForm] ChangePasswordInfo info)
        {
            ResponseData res = new ResponseData();
            try
            {
                res = _ApprovalFlowService.ChangePassword(info);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }

        // 重置密码
        [CustomAllowAnonymous]
        public ResponseData ResetPassword([FromForm] ChangePasswordInfo info)
        {
            ResponseData res = new ResponseData();
            try
            {
                info.OldPasswd = null;
                res = _ApprovalFlowService.ResetPassword(info);
            }
            catch (Exception ex)
            {
                res.Code = 400;
                res.Message = ex.Message;
            }
            return res;
        }
    }
}
