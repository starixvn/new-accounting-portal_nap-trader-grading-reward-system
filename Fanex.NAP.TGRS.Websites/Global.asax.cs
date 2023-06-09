// --------------------------------------------------------------------------
// <copyright file="Global.asax.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.31">Register Fanex.Data.</change>
// </history>

namespace Fanex.NAP.TGRS.Websites
{
    using Fanex.Data;
    using Fanex.Data.MySql;
    using Fanex.Data.SqlServer;
    //using Fanex.Data.Configuration;
    using Fanex.Logging;
    using Fanex.Logging.Sentry;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Infrastructure;
    using ONEbook.UM;
    using ONEbook.UM.AspNetMVC.Configuration;
    using ONEbook.UM.Helpers;
    using ONEbook.UM.Transport;
    using RemotingRef;
    using Sentry;
    using Simplect;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Data.SqlClient;
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;

    /// <summary>
    /// MVC application configuration.
    /// </summary>
    [System.Runtime.InteropServices.GuidAttribute("62BE590A-9400-4F23-B796-EA091818AF78")]
    public class MvcApplication : HttpApplication
    {
        /// <summary>
        /// Sets all needed configuration when the application starts.
        /// </summary>
        protected void Application_Start()
        {
            DbSettingProviderManager
                .StartNewSession()
                .WithSqlServer()
                .WithMySql()
                .UseDefaultDbSettingProvider(AppSettings.StoredProcedurePath)
                .UseDefaultConnectionStringProvider()
                .Run();

            LogManager.SetDefaultLogCategory(ConfigurationManager.AppSettings["Sentry-Log-Category"])
                  .Use(new List<ILogEngine>
                  {
                         new SentryLogging(new SentryEngineOptions
                         {
                             Dsn = new Dsn(ConfigurationManager.AppSettings["Sentry-Log-Config"])
                         })
                  });

            AreaRegistration.RegisterAllAreas();

            InjectorFactory.CurrentInjector.Bind<IControllerActivator>().Using<ControllerActivator>();
            ControllerBuilder.Current.SetControllerFactory(InjectorFactory.CurrentInjector.Resolve<DefaultControllerFactory>());

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            RefDataTypeContainer
              .ConnectTo(new Uri(ConfigurationManager.AppSettings["Fanex.RemotingRef.Service.Url"]))
              .FromApplication("SPU - TGRS");

            var umConfig = new UMClientConfiguration();
            UMClientManager
                .UseConfig(umConfig)
                .UseRestClient(new RestClient(umConfig))
                .UseHttpContext(new HttpContextHelper());          
        }

        /// <summary>
        /// Handles the Error event of the Application.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="EventArgs"/> instance containing the event data.</param>
        protected void Application_Error(object sender, EventArgs e)
        {
            Exception ex = Server.GetLastError().GetBaseException();
            SqlException sqlEx = ex as SqlException;
            string exceptionFormat = "{0}\r\nType: {1}" +
                                     "\r\nSource: {2}" +
                                     "\r\nDomain: {3}" +
                                     "\r\nReferrer: {4}" +
                                     "\r\nIP: {5}" +
                                     "\r\nUserAgent: {6}" +
                                     "\r\nForm Variable: {7}" +
                                     "\r\nQueryString: {8}" +
                                     "\r\nTargetSite: {9}" +
                                     "\r\nStackTrace: {10}";

            if (!Request.IsLocal)
            {
                string message = string.Format(
                                            exceptionFormat,
                                            ex.Message + "\r\n" + ex.InnerException.Message,
                                            ex.GetType().ToString(),
                                            ex.Source,
                                            HttpContext.Current.Request.Headers["Host"],
                                            HttpContext.Current.Request.UrlReferrer,
                                            HttpContext.Current.Request.UserHostAddress,
                                            HttpContext.Current.Request.UserAgent,
                                            Request.Form.ToString(),
                                            Request.QueryString.ToString(),
                                            ex.TargetSite,
                                            ex.StackTrace);

                // Get additional exception data for SqlException.
                if (sqlEx != null)
                {
                    message += string.Format(
                                          "\r\nProcedure: {0}\r\nLine Number: {1}\r\nServer: {2}",
                                          sqlEx.Procedure,
                                          sqlEx.LineNumber,
                                          sqlEx.Server);
                }

                LogService.Error(message);
            }
        }
    }
}