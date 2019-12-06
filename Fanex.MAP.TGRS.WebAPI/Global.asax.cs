namespace Fanex.NAP.TGRS.WebAPI
{
    using Fanex.Data;
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
                .UseDefaultConnectionStringProvider()
                .UseDefaultDbSettingProvider(resourcePath: ConfigurationManager.AppSettings["UAT"] ?? "~/App_Data", enableWatching: true)
                .Run();
                
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
