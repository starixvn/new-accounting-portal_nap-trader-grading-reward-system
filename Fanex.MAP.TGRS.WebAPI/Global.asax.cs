namespace Fanex.NAP.TGRS.WebAPI
{
    using Fanex.Data;
    using Fanex.Data.SqlServer;
    using Fanex.Logging;
    using Fanex.Logging.Sentry;
    using Sentry;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            DbSettingProviderManager
                .StartNewSession()
                .WithSqlServer()
                .UseDefaultDbSettingProvider(resourcePath: ConfigurationManager.AppSettings["UAT"] ?? "~/App_Data")
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
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
                        
        }
    }
}