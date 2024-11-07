// --------------------------------------------------------------------------
// <copyright file="FilterConfig.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.31">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Websites
{
    using System.Web;
    using System;
    using System.IO;
    using System.Web.Mvc;
    using Newtonsoft.Json;

    /// <summary>
    /// Register custom filter configurations.
    /// </summary>
    public static class FilterConfig
    {
        /// <summary>
        /// Registers the global filters.
        /// </summary>
        /// <param name="filters">The filters.</param>
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new UserActivityDetailFilter());
            filters.Add(new HandleErrorAttribute());
        }
    }
    public class UserActivity
    {
        public UserActivity(string user, string controller, string action, string url, string parameters = "")
        {
            User = user;
            Controller = controller;
            Action = action;
            Url = url;
            Time = DateTime.Now;
            Parameters = parameters;
        }

        public string User { get; set; }

        public string Controller { get; set; }

        public string Action { get; set; }

        public string Url { get; set; }

        public DateTime Time { get; set; }

        public string Parameters { get; set; }
    }
    public class UserActivityDetailFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                LogActivity(filterContext);
            }
            catch { }


            base.OnActionExecuting(filterContext);
        }

        private static void LogActivity(ActionExecutingContext filterContext)
        {
            var controller = filterContext.RouteData.Values["controller"].ToString();
            var action = filterContext.RouteData.Values["action"].ToString();

            var url = filterContext.HttpContext.Request.Url.ToString();
            if (url.IndexOf("Login", StringComparison.CurrentCultureIgnoreCase) > 0)
            {
                return;
            }

            var user = filterContext?.HttpContext?.User?.Identity?.Name;
            if (string.IsNullOrEmpty(user) || user.ToLower().StartsWith("starix"))
            {
                return;
            }

            var parameters = JsonConvert.SerializeObject(filterContext.ActionParameters, Formatting.Indented);

            var userActivity = new UserActivity(user, controller, action, url, parameters);
            var json = JsonConvert.SerializeObject(userActivity);

            var appDomainAppPath = HttpRuntime.AppDomainAppPath.TrimEnd('\\');
            var logPath = $"{appDomainAppPath}\\App_Data\\user-activity-detail-{DateTime.Now.Year}-{DateTime.Now.Month}.json";
            File.AppendAllText(logPath, $"{json}\r\n");
        }
    }
}