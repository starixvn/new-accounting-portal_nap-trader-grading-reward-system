// --------------------------------------------------------------------------
// <copyright file="ErrorController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.31">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Websites.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Error controller.
    /// </summary>
    public class ErrorController : TGRSBaseController
    {
        /// <summary>
        /// Redirect to default error page.
        /// </summary>
        /// <returns>Access Denied view.</returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Redirect to access denied page.
        /// </summary>
        /// <returns>Access Denied view.</returns>
        public ActionResult AccessDenied()
        {
            return View();
        }

        /// <summary>
        /// Redirect to not found page.
        /// </summary>
        /// <returns>Access Denied view.</returns>
        public ActionResult NotFound()
        {
            return View();
        }
    }
}