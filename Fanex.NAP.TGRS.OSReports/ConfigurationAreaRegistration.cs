namespace Fanex.NAP.TGRS.OSReports
{
    using System.Web;
    using System.Web.Mvc;

    /// <summary>
    /// Registers Config area.
    /// </summary>
    public class OSReportsAreaRegistration : AreaRegistration
    {
        private static object _scopeObj = new object();

        public override string AreaName
        {
            get
            {
                return "OSReports";
            }
        }

        /// <summary>
        /// Registers an area in an ASP.NET MVC application using the specified area's context information.
        /// </summary>
        /// <param name="context">Encapsulates the information that is required in order to register the area.</param>
        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "OSReports_default",
                "OSReports/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional });

            //Registerdependency();
        }
    }
}