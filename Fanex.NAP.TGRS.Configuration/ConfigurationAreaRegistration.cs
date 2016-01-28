// --------------------------------------------------------------------------
// <copyright file="ConfigurationAreaRegistration.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration
{
    using Configuration.Services.SpreadManagement;
    using Core.ExcelUtility.ExcelIOExtensions;
    using Core.ExcelUtility.ExcelIOExtensions.DefaultImplementation;
    using Simplect;
    using Simplect.BindingSyntax;
    using System.Web;
    using System.Web.Mvc;

    /// <summary>
    /// Registers Config area.
    /// </summary>
    public class ConfigurationAreaRegistration : AreaRegistration
    {
        private static object _scopeObj = new object();

        public override string AreaName
        {
            get
            {
                return "Configuration";
            }
        }

        /// <summary>
        /// Registers an area in an ASP.NET MVC application using the specified area's context information.
        /// </summary>
        /// <param name="context">Encapsulates the information that is required in order to register the area.</param>
        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Configuration_default",
                "Configuration/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional });

            Registerdependency();
        }

        private void Registerdependency()
        {
            InjectorFactory.CurrentInjector.Bind<ISpreadManagementService>().Using<SpreadManagementService>();
            InjectorFactory.CurrentInjector.Bind<FileObjectMapper<HttpPostedFileBase>>()
                .Using<HttpExcelMapper>().WithBinding(b => b.InScope(() => _scopeObj));
        }
    }
}