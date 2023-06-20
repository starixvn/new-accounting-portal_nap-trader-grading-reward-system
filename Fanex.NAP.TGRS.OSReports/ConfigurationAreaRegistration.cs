namespace Fanex.NAP.TGRS.OSReports
{
    using Fanex.NAP.TGRS.OSReports.Services.Implement;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using Simplect;
    using System.Web.Mvc;

    /// <summary>
    /// Registers Config area.
    /// </summary>
    public class OSReportsAreaRegistration : AreaRegistration
    {
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

            RegisterDependency();
        }

        private static void RegisterDependency()
        {
            InjectorFactory.CurrentInjector.Bind<ITraderPerformanceService>().Using<TraderPerformanceService>();

            InjectorFactory.CurrentInjector.Bind<INewTraderPerformanceService>().Using<NewTraderPerformanceService>();

            InjectorFactory.CurrentInjector.Bind<ITraderPerformanceByCCService>().Using<TraderPerformanceByCCService>();
        }
    }
}