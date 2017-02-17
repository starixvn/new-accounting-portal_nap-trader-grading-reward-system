// --------------------------------------------------------------------------
// <copyright file="GradeManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.13">Created</change>
// </history>
namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.GradeManagement;
    using Fanex.NAP.TGRS.Configuration.Services.GradeManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.GradeManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Grade controller.
    /// </summary>
    public class GradeManagementController : TGRSBaseController
    {
        #region Members

        private readonly IGradeManagementService _gradeService;

        #endregion Members

        #region Constructors

        [Simplect.Attribute.InjectObject]
        public GradeManagementController()
            : this(null)
        {
        }

        public GradeManagementController(IGradeManagementService gradeService)
        {
            this._gradeService = gradeService ?? new GradeManagementService();
        }

        #endregion Constructors

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        //// [NapAuth(FunctionKey = TGRSFunctionKeys.GradeManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            //// ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.GradeManagement, Constant.Policy.Host);
            return View();
        }

        /// <summary>
        /// Get all Grades.
        /// </summary>
        /// <returns>List of JSON objects.</returns>
        [HttpPost]
        //// [NapAuth(FunctionKey = TGRSFunctionKeys.GradeManagement, Policy = Constant.Policy.Read)]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Need to review here.")]
        public JsonResult GetAllGrade()
        {
            GradeInfoList result = this._gradeService.GetAllGrade(new GetAllGradesCriteria());

            return Json(result);
        }

        /// <summary>
        /// Add new Grade.
        /// </summary>
        /// <param name="criteria">Criteria that are used to insert data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        //// [NapAuth(FunctionKey = TGRSFunctionKeys.GradeManagement, Policy = Constant.Policy.Read)]
        public JsonResult InsertGrade(InsertGradeCriteria criteria)
        {
            ICommandResult result = null;
            GradeInfoList updatedItems = null;

            criteria.GradeName = criteria.GradeName ?? string.Empty;
            criteria.Description = criteria.Description ?? string.Empty;
            criteria.UserId = this.CurrentSession.UserId;
            result = this._gradeService.InsertGrade(criteria);

            if (result.IsSuccessful)
            {
                updatedItems = this._gradeService.GetAllGrade(new GetAllGradesCriteria());
            }

            return Json(new
            {
                ErrorCode = result.Code,
                ErrorMessage = result.Message,
                UpdatedItems = updatedItems
            });
        }

        /// <summary>
        /// Update Grade.
        /// </summary>
        /// <param name="criteria">Criteria that are used to update data.</param>
        /// <returns>JSON object indicates the result of insert.</returns>
        [HttpPost]
        //// [NapAuth(FunctionKey = TGRSFunctionKeys.GradeManagement, Policy = Constant.Policy.Read)]
        public JsonResult UpdateGrade(UpdateGradeCriteria criteria)
        {
            ICommandResult result = null;
            GradeInfoList updatedItems = null;

            criteria.GradeName = criteria.GradeName ?? string.Empty;
            criteria.Description = criteria.Description ?? string.Empty;
            criteria.UserId = this.CurrentSession.UserId;
            result = this._gradeService.UpdateGrade(criteria);

            if (result.IsSuccessful)
            {
                updatedItems = this._gradeService.GetAllGrade(new GetAllGradesCriteria());
            }

            return Json(new
            {
                ErrorCode = result.Code,
                ErrorMessage = result.Message,
                UpdatedItems = updatedItems
            });
        }
    }
}