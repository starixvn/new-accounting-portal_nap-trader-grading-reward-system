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
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Mvc;
    using Core.BaseClasses;
    using Core.Configurations;
    using Core.ExcelUtility.ExcelIOExtensions;
    using Core.Helpers;
    using Core.Resources;
    using Criteria.SpreadManagement;
    using Models.SpreadManagement;
    using NAP.Core.Business;
    using NAP.Core.Web;
    using NAP.Core.Web.Attribute;
    using Services.SpreadManagement;
    using System.Runtime.Serialization.Formatters.Binary;
    using System.IO;

    public class SpreadManagementController : TGRSBaseController
    {
        private const string SpreadManagementExcelPath = @"~\Areas\Configuration\ExcelTemplates\SpreadManagement.xlsx";

        private readonly ISpreadManagementService _spreadManagementService;

        private readonly FileObjectMapper<HttpPostedFileBase> _excelReader;

        public SpreadManagementController(ISpreadManagementService spreadManagementService, FileObjectMapper<HttpPostedFileBase> excelMapper)
        {
            _spreadManagementService = spreadManagementService;
            _excelReader = excelMapper;
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
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Host)]
        public ActionResult PopupResult(HttpPostedFileBase file)
        {
            try
            {
                var spreads = _excelReader.Read<SpreadChecker>(file);
                var correctSpreads = new Queue<SpreadChecker>();
                var errorSpreads = new Queue<SpreadChecker>();

                ValidateSpreads(spreads, correctSpreads, errorSpreads);

                CacheCorrectSpreads(correctSpreads);

                var spreadValidation = new SpreadValidation()
                {
                    ErrorSpreads = errorSpreads,
                    TotalSpreads = correctSpreads.Count + errorSpreads.Count,
                    IsShowUpdateSpreadInProgress = correctSpreads.Count + errorSpreads.Count > AppSettings.TotalRowsForShowUpdateSpreadInProgress
                };

                return Json(spreadValidation, JsonRequestBehavior.AllowGet);
            }
            catch (ColumnMappingException)
            {
                return Json(Messages.WrongFormatSpreadTemplate);
            }
            catch (Exception ex)
            {
                return Json(ex.Message + ", stacktrace: " + ex.StackTrace + ", source:" + ex.Source);
            }
        }

        private static void CacheCorrectSpreads(Queue<SpreadChecker> correctSpreads)
        {
            if (correctSpreads.Count > 0)
            {
                var currentUser = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
                CacheManager.Set<IEnumerable<SpreadChecker>>(currentUser + "_Spreads", correctSpreads);
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
            var creatorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;

            Func<IEnumerable<SpreadChecker>, bool> functionUpdateSpread =
             spreads =>
             {
                 var correctSpreads = spreads.Batch(AppSettings.BatchSizeForUpdateSpread);
                 var resultUpdate = true;

                 foreach (var spread in correctSpreads)
                 {
                     criteria.CreatorId = creatorId;
                     criteria.SpreadDoc = CreateXmlParamForInsertingSpreadInfo(spread);

                     resultUpdate = resultUpdate && _spreadManagementService.UpdateSpread(criteria).IsSuccessful;
                 }

                 return resultUpdate;
             };

            var correctSpreadsCache = GetCorrectSpreadsCache();

            if (correctSpreadsCache != null)
            {
                if (correctSpreadsCache.Count() > AppSettings.TotalRowsForShowUpdateSpreadInProgress)
                {
                    Task.Factory.StartNew(() => functionUpdateSpread(correctSpreadsCache));
                }
                else
                {
                    Task.Factory.StartNew(() => functionUpdateSpread(correctSpreadsCache)).Wait();
                }
            }

            return Json(string.Empty, JsonRequestBehavior.AllowGet);
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
                LeagueName = leagueName ?? string.Empty,
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
            var correctSpreadsCache = CacheManager.Get<IEnumerable<SpreadChecker>>(currentUser + "_Spreads");
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