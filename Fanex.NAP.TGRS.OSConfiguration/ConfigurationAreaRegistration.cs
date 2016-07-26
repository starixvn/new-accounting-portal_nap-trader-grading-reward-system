namespace Fanex.NAP.TGRS.OSConfiguration
{
    using System.Web.Mvc;

    /// <summary>
    /// Registers Config area.
    /// </summary>
    public class OSConfigurationAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "OSConfiguration";
            }
        }

        /// <summary>
        /// Registers an area in an ASP.NET MVC application using the specified area's context information.
        /// </summary>
        /// <param name="context">Encapsulates the information that is required in order to register the area.</param>
        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "OSConfiguration_default",
                "OSConfiguration/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional });

            //Registerdependency();
        }
    }
}