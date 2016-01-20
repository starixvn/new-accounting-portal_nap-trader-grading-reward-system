// --------------------------------------------------------------------------
// <copyright file="SpreadManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.1.20">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Web.Mvc;
    using Core.BaseClasses;
    using Criteria.SpreadManagement;
    using NAP.Core.Business;
    using NAP.Core.Web.Attribute;
    using Services.SpreadManagement;

    public class SpreadManagementController : TGRSBaseController
    {
        private readonly ISpreadManagementService _spreadManagementService;

        public SpreadManagementController()
            : this(null)
        {
        }

        public SpreadManagementController(ISpreadManagementService spreadManagementService)
        {
            _spreadManagementService = spreadManagementService ?? new SpreadManagementService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Read)]
        public ActionResult GetAllSpread(string leagueName)
        {
            var spreads = _spreadManagementService.GetAllSpread(new GetAllSpreadCriteria
                {
                    LeagueName = leagueName
                });

            return Json(spreads, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Host)]
        public ActionResult UpdateSpread(UpdateSpreadCriteria criteria)
        {
            var result = _spreadManagementService.UpdateSpread(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}