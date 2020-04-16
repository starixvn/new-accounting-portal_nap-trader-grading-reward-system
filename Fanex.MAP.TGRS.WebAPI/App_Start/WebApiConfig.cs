namespace Fanex.NAP.TGRS.WebAPI
{
    using System.Web.Http;

    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "TGRS/{controller}/{action}",
                defaults: new { controller = "Trader" }
            );
        }

        public static HttpConfiguration Register()
        {
            HttpConfiguration config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "TGRS/{controller}/{action}",
                defaults: new { controller = "Trader" }
            );

            return config;
        }
    }
}
