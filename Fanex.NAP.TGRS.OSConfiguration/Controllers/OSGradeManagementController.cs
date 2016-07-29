// --------------------------------------------------------------------------
// <copyright file="GradeManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.7.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.GradeManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.GradeManagement;
    using System.Web.Mvc;

    public class OSGradeManagementController : TGRSBaseController
    {
        private readonly IGradeManagementService _gradeService;

        [Simplect.Attribute.InjectObject]
        public OSGradeManagementController()
            : this(null)
        {
        }

        public OSGradeManagementController(IGradeManagementService gradeService)
        {
            this._gradeService = gradeService ?? new GradeManagementService();
        }

        //[NapAuth(FunctionKey = TGRSFunctionKeys.OSGradeManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = true;//this.HasRight(TGRSFunctionKeys.OSGradeManagement, Constant.Policy.Host);
            return View();
        }

        //[NapAuth(FunctionKey = TGRSFunctionKeys.GradeManagement, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetAllGrade()
        {
            var result = _gradeService.GetAllGrade();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //[NapAuth(FunctionKey = TGRSFunctionKeys.OSGradeManagement, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult InsertGrade(InsertGradeCriteria criteria)
        {
            criteria.GradeName = criteria.GradeName ?? string.Empty;

            var result = this._gradeService.InsertGrade(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        //[NapAuth(FunctionKey = TGRSFunctionKeys.OSGradeManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateGrade(UpdateGradeCriteria criteria)
        {
            criteria.GradeName = criteria.GradeName ?? string.Empty;

            var result = this._gradeService.UpdateGrade(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}