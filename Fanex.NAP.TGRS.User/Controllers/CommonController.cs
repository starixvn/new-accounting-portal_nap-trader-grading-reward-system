// --------------------------------------------------------------------------
// <copyright file="CommonController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Edward.Nguyen" date="2013.1.4">Created</change>
//   <change who="Jason.Ly" date="2014.3.31">Add to TGRS project.</change>
// </history>

namespace Fanex.NAP.TGRS.User.Controllers
{
    using System.Web.Mvc;
    using System.Web.Security;
    using ONEbook.UM.Services;
    using System.Threading.Tasks;
    using Core.BaseClasses;

    /// <summary>
    /// Common controller.
    /// </summary>
    public class CommonController : TGRSBaseController
    {
        [Simplect.Attribute.InjectObject]
        public CommonController()
        {
        }

        /// <summary>
        /// Offline this instance.
        /// </summary>
        /// <returns>Return status of maintenance.</returns>
        public async Task<ActionResult> Offline()
        {
            var maintenanceService = new MaintenanceService();
            var downTime = await maintenanceService.GetUnderMaintenanceTime();

            if (!downTime.IsUnderMaintenanceTime)
            {
                return RedirectToAction("LogOut", "Login");
            }

            ViewBag.UmtFrom = downTime.From;
            ViewBag.UmtTo = downTime.To;

            return View();
        }
    }
}