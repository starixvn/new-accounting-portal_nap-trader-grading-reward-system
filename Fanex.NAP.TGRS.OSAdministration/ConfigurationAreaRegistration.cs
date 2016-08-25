namespace Fanex.NAP.TGRS.OSConfiguration
{
    using System.Web.Mvc;

    public class OSAdministrationAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "OSAdministration";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "OSAdministration_default",
                "OSAdministration/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional });

            Registerdependency();
        }

        private void Registerdependency()
        {
        }
    }
}