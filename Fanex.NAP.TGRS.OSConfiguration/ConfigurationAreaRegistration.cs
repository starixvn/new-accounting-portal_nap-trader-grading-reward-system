using Fanex.NAP.TGRS.OSConfiguration.Services.GradeManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.Implement;
using Fanex.NAP.TGRS.OSConfiguration.Services.Interface;
using Fanex.NAP.TGRS.OSConfiguration.Services.TeamManagement;
using Fanex.NAP.TGRS.OSConfiguration.Services.TraderManagement;

namespace Fanex.NAP.TGRS.OSConfiguration
{
    using System.Web.Mvc;
    using Simplect;
    using Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement;

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

            Registerdependency();
        }

        private void Registerdependency()
        {
            InjectorFactory.CurrentInjector.Bind<IEPADeductionManagementService>().Using<EPADeductionManagementService>();
            InjectorFactory.CurrentInjector.Bind<ITraderManagementService>().Using<TraderManagementService>();
            InjectorFactory.CurrentInjector.Bind<ITeamManagementService>().Using<TeamManagementService>();
            InjectorFactory.CurrentInjector.Bind<IGradeManagementService>().Using<GradeManagementService>();
            InjectorFactory.CurrentInjector.Bind<IIssueService>().Using<IssueService>();
            InjectorFactory.CurrentInjector.Bind<ISettingService>().Using<SettingService>();
            InjectorFactory.CurrentInjector.Bind<IErrorService>().Using<ErrorService>();
        }
    }
}