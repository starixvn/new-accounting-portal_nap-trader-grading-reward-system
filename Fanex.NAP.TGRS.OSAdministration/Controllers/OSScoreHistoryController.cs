// --------------------------------------------------------------------------
// <copyright file="OSScoreHistoryController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.8.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSConfiguration.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreHistory;
    using Fanex.NAP.TGRS.OSAdministration.Services.Implement;
    using Fanex.NAP.TGRS.OSAdministration.Services.Interface;
    using System.Web.Mvc;

    public class OSScoreHistoryController : TGRSBaseController
    {
        private readonly IScoreHistoryService _scoreHistoryService;

        public OSScoreHistoryController(IScoreHistoryService scoreHistoryService)
        {
            this._scoreHistoryService = scoreHistoryService ?? new ScoreHistoryService();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSScoreHistory, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.OSScoreHistory, Constant.Policy.Host);
            return View();
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSScoreHistory, Policy = Constant.Policy.Read)]
        [HttpGet]
        public JsonResult GetAllScoreHistory()
        {
            var result = _scoreHistoryService.GetAllScoreHistory();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = TGRSFunctionKeys.OSScoreHistory, Policy = Constant.Policy.Host)]
        [HttpPost]
        public JsonResult DeleteScoreHistory(DeleteScoreHistoryCriteria criteria)
        {
            criteria.UserId = this.CurrentSession.UserId;

            var result = this._scoreHistoryService.DeleteScoreHistory(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.OSScoreHistory, Policy = Constant.Policy.Read)]
        public JsonResult GetScoreHistoryByPeriod(GetScoreHistoryDetailByPeriodCriteria criteria)
        {
            var result = this._scoreHistoryService.GetScoreHistoryDetailByPeriod(criteria);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}