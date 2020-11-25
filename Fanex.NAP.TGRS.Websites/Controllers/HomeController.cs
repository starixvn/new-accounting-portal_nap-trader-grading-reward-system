// --------------------------------------------------------------------------
// <copyright file="HomeController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.31">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Websites.Controllers
{
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using System;
    using System.Web;
    using System.Web.Mvc;

    [NapSuperAuth]
    public class HomeController : TGRSBaseController
    {
        public HomeController()
        {
        }

        public ActionResult Index()
        {
            Response.Cookies.Add(new HttpCookie("menu-id") { Expires = DateTime.Now.AddDays(-1d) });

            if (this.HasRight(TGRSFunctionKeys.PerformanceSummary, NAP.Core.Business.Constant.Policy.Read))
            {
                return RedirectToAction("../Reports/Dashboard");
            }
            else if (this.HasRight(TGRSFunctionKeys.PerformanceSummaryComparison, NAP.Core.Business.Constant.Policy.Read))
            {
                return RedirectToAction("../OSReports/OSDashboard/BasketBallDashboard");
            }
            else if (this.HasRight(TGRSFunctionKeys.OSPerformanceSummary, NAP.Core.Business.Constant.Policy.Read))
            {
                return RedirectToAction("../OSReports/OSDashboard");
            }
            else if (this.HasRight(TGRSFunctionKeys.TraderReport, NAP.Core.Business.Constant.Policy.Read))
            {
                return RedirectToAction("../Reports/Trader");
            }
            else
            {
                return View();
            }
            ////else if (this.HasRight(TGRSFunctionKeys.OSTraderReport, NAP.Core.Business.Constant.Policy.Read))
            ////{
            ////    return RedirectToAction("../OSReports/OSTrader");
            ////}
        }

        [ChildActionOnly]
        public PartialViewResult Menu()
        {
            ViewBag.MenuItemList = CurrentSession.MenuItemList;
            return PartialView("~/Views/Shared/_Menu.cshtml");
        }
    }
}