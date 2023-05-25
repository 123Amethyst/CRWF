using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Infrastructure
{
    /// <summary>
    /// 方法过滤器
    /// </summary>
    public class CustomActionFilterAttribute : Controller
    {
        /// <summary>
        /// 方法执行前
        /// </summary>
        /// <param name="context"></param>
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //表示如果带有该属性，就不进行下面的步骤，直接返回
            base.OnActionExecuting(context);
            if (context.ActionDescriptor.EndpointMetadata.Any(item => item.GetType() == typeof(CustomAllowAnonymousAttribute))) //如果标记的有特殊的记号，就避开检查；
            {
                return;
            }
            string cookieKey = "";
            context.HttpContext.Request.Cookies.TryGetValue("CurrentUser", out cookieKey);
            string str = cookieKey != null ? context.HttpContext.Session.GetString(cookieKey) : null;
            if (string.IsNullOrEmpty(str))
            {
                //var result = new ViewResult { ViewName = "~/Views/Home/Login.cshtml" };
                //result.ViewData = new ViewDataDictionary(_modelMetadataProvider, context.ModelState);
                //result.ViewData.Add("Exception", context.Exception);
                //context.HttpContext.Response.Redirect("/Home/Login");
                //return;
                context.Result = new RedirectToActionResult("Login", "Home", "/Home/Login"); //重定向
                //context.Result = new RedirectToActionResult("Login", "Home", "/Home/Login"); //重定向
                //RedirectToAction("MyList", "Treausre")//result; //断路器---只要对Result赋值--就不继续往后了;
            }
        }
        /// <summary>
        /// 方法执行后
        /// </summary>
        /// <param name="context"></param>
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.ActionDescriptor.EndpointMetadata.Any(item => item.GetType() == typeof(CustomAllowAnonymousAttribute))) //如果标记的有特殊的记号，就避开检查；
            {
                return;
            }
        }
    }

    public class CustomAllowAnonymousAttribute : Attribute
    {
    }
}
