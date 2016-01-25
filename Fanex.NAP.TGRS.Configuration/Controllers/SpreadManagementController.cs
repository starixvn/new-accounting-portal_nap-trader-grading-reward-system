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
    using Core.Helpers;
    using Criteria.SpreadManagement;
    using NAP.Core.Business;
    using NAP.Core.Web.Attribute;
    using Services.SpreadManagement;

    public class SpreadManagementController : TGRSBaseController
    {
        private const string SpreadManagementExcelPath = @"~\Areas\Configuration\ExcelTemplates\SpreadManagement.xls";

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

        public ActionResult DownloadTemplate()
        {
            return File("~/App_Data/SpreadTemplate/SpreadTemplate.xls", "application/ms-excel", "SpreadTemplate.xls");
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Read)]
        public ActionResult GetAllSpread(GetAllSpreadCriteria criteria)
        {
            var spreadList = _spreadManagementService.GetAllSpread(criteria);

            return Json(spreadList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Host)]
        public ActionResult UpdateSpread(UpdateSingleSpreadCriteria criteria)
        {
            criteria.CreatorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var result = _spreadManagementService.UpdateSpread(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Host)]
        public ActionResult DeleteSpread(DeleteSpreadCriteria criteria)
        {
            criteria.CreatorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var result = _spreadManagementService.DeleteSpread(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Read)]
        public ActionResult ExportSpreadList(string leagueName)
        {
            var templatePath = Server.MapPath(SpreadManagementExcelPath);
            var criteria = new GetAllSpreadCriteria
            {
                LeagueName = leagueName,
                PageIndex = 1,
                PageSize = int.MaxValue
            };

            _spreadManagementService.ExportSpreadList(criteria, templatePath);

            return new EmptyResult();
        }
    }
}