// --------------------------------------------------------------------------
// <copyright file="SpreadManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.1.20">Created</change>
//   <change who="Thai.Tran" date="2016.1.20">Updated</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Web;
    using System.Web.Mvc;
    using Core.BaseClasses;
    using Core.ExcelUtility.ExcelIOExtensions;
    using Core.ExcelUtility.ExcelIOExtensions.DefaultImplementation;
    using Core.Helpers;
    using Criteria.SpreadManagement;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.Configurations;
    using Models.SpreadManagement;
    using NAP.Core.Business;
    using NAP.Core.Web.Attribute;
    using Services.SpreadManagement;

    public class SpreadManagementController : TGRSBaseController
    {
        private const string SpreadManagementExcelPath = @"~\Areas\Configuration\ExcelTemplates\SpreadManagement.xls";

        private readonly ISpreadManagementService _spreadManagementService;

        private readonly FileObjectMapper<HttpPostedFileBase> _excelReader;

        public SpreadManagementController()
            : this(null, null)
        {
        }

        public SpreadManagementController(ISpreadManagementService spreadManagementService, FileObjectMapper<HttpPostedFileBase> excelMapper)
        {
            _spreadManagementService = spreadManagementService ?? new SpreadManagementService();
            _excelReader = excelMapper ?? new HttpExcelMapper();
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
        public ActionResult PopupResult(HttpPostedFileBase file)
        {
            var spreads = _excelReader.Read<SpreadChecker>(file);
            var correctSpreads = new Queue<SpreadChecker>();
            var errorSpreads = new Queue<SpreadChecker>();
            
            ValidateSpreads(spreads, correctSpreads, errorSpreads);

            CacheCorrectSpreads(correctSpreads);

            var spreadValidation = new SpreadValidation() { ErrorSpreads = errorSpreads, TotalSpreads = correctSpreads.Count + errorSpreads.Count };
            return Json(spreadValidation, JsonRequestBehavior.AllowGet);
        }

        private static void CacheCorrectSpreads(Queue<SpreadChecker> correctSpreads)
        {
            if (correctSpreads.Count > 0)
            {
                var currentUser = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
                CacheManager.Set<IEnumerable<SpreadChecker>>(currentUser.ToString() + "_Spreads", correctSpreads);
            }
        }

        private void ValidateSpreads(IEnumerable<SpreadChecker> spreads, Queue<SpreadChecker> correctSpreads, Queue<SpreadChecker> errorSpreads)
        {            
            var bettypeIds = _spreadManagementService.GetBettypeIdsList().Select(b => b.BetType).ToArray();
            var leagueIds = _spreadManagementService.GetLeagueIdsList().Select(b => b.LeagueId).ToArray();

            foreach (var spreadInfo in spreads)
            {                                
                if (IsValidSpread(spreadInfo)
                    && IsValidBettypeAndLeague(bettypeIds, leagueIds, spreadInfo))
                {
                    correctSpreads.Enqueue(spreadInfo);
                }                                
                else
                {
                    errorSpreads.Enqueue(spreadInfo);
                }
            }
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Read)]
        public ActionResult GetAllSpread(GetAllSpreadCriteria criteria)
        {
            if (criteria.LeagueName != null)
            {
                criteria.LeagueName = criteria.LeagueName.Trim();
            }

            var spreadList = _spreadManagementService.GetAllSpread(criteria);

            return Json(spreadList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Host)]
        public ActionResult UpdateSpread(UpdateSpreadCriteria criteria)
        {
            var correctSpreadsCache = GetCorrectSpreadsCache();

            var correctSpreads = IEnumerableExtensions.Batch<SpreadChecker>(correctSpreadsCache, AppSettings.BatchSizeForUpdateSpread);
            bool result = true;

            foreach (var spread in correctSpreads)
            {
                criteria.CreatorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
                criteria.SpreadDoc = correctSpreadsCache != null ? CreateXmlParamForInsertingSpreadInfo(spread) : string.Empty;

                result = result && _spreadManagementService.UpdateSpread(criteria).IsSuccessful;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }      

        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Host)]
        public ActionResult UpdateSingleSpread(UpdateSingleSpreadCriteria criteria)
        {
            criteria.CreatorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var result = _spreadManagementService.UpdateSingleSpread(criteria);

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

        [HttpGet]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Read)]
        public ActionResult GetHostPermission()
        {
            return Json(PermissionService.HasHostPermission(TGRSFunctionKeys.SpreadManagement), JsonRequestBehavior.AllowGet);
        }

        private IEnumerable<SpreadChecker> GetCorrectSpreadsCache()
        {
            var currentUser = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var correctSpreadsCache = CacheManager.Get<IEnumerable<SpreadChecker>>(currentUser.ToString() + "_Spreads");
            return correctSpreadsCache;
        }

        private string CreateXmlParamForInsertingSpreadInfo(IEnumerable<SpreadChecker> spreads)
        {
            var builder = new StringBuilder();
            builder.Append("<Root>");

            foreach (var spreadInfo in spreads)
            {
                builder.Append("<Row>");
                builder.Append(GetElement("LeagueId", spreadInfo.LeagueId));
                builder.Append(GetElement("BettypeId", spreadInfo.BetTypeId));
                builder.Append(GetElement("Spread", spreadInfo.Spread));
                builder.Append("</Row>");
            }

            builder.Append("</Root>");

            return builder.ToString();
        }

        private string GetElement(string tagName, object value)
        {
            return string.Format("<{0}>{1}</{0}>", tagName, value);
        }

        private bool IsValidSpread(SpreadChecker spread)
        {
            int outBettypeId;
            int outLeagueId;
            int outSpread;

            return int.TryParse(spread.BetTypeId, out outBettypeId) &&
                    int.TryParse(spread.LeagueId, out outLeagueId) &&
                    int.TryParse(spread.Spread, out outSpread);
        }

        private bool IsValidBettypeAndLeague(int[] bettypeIds, int[] leagueIds, SpreadChecker spreadInfo)
        {
            return BinarySearch(bettypeIds, int.Parse(spreadInfo.BetTypeId))
                && BinarySearch(leagueIds, int.Parse(spreadInfo.LeagueId));            
        }

        private bool BinarySearch(IList<int> list, int criteria)
        {
            return BinarySearchHelper(list, 0, list.Count - 1, criteria);
        }

        private bool BinarySearchHelper(IList<int> list, int start, int end, int criteria)
        {
            if (start <= end)
            {
                var mid = (start + end) / 2;
                var midElement = list[mid];
                return midElement < criteria ? BinarySearchHelper(list, mid + 1, end, criteria) :
                       midElement <= criteria || BinarySearchHelper(list, start, mid - 1, criteria);
            }

            return false;
        }
    }
}