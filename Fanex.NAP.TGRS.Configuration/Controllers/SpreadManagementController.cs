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

    public class SpreadManagementController : TGRSBaseController
    {
        private const string SpreadManagementExcelPath = @"~\Areas\Configuration\ExcelTemplates\SpreadManagement.xlsx";

        private static IDictionary<Guid, int> _uploadTasks = new Dictionary<Guid, int>();

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
                    TotalSpreads = correctSpreads.Count + errorSpreads.Count
                };

                return Json(spreadValidation, JsonRequestBehavior.AllowGet);
            }
            catch (ColumnMappingException)
            {
                return Json(Messages.WrongFormatSpreadTemplate);
            }
            catch (Exception)
            {
                throw;
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
            var taskId = Guid.NewGuid();
            _uploadTasks.Add(taskId, 0);

            var creatorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;

            Func<IEnumerable<SpreadChecker>, bool> functionUpdateSpread =
             spreads =>
             {
                 var correctSpreads = spreads.Batch(AppSettings.BatchSizeForUpdateSpread);
                 var resultUpdate = true;
                 int correctSpreadsCount = correctSpreads.Count();
                 int i = 1;

                 foreach (var spread in correctSpreads)
                 {
                     criteria.CreatorId = creatorId;
                     criteria.SpreadDoc = CreateXmlParamForInsertingSpreadInfo(spread);

                     _uploadTasks[taskId] = Convert.ToInt16(100 * (((i++) * 1.0) / correctSpreadsCount));  // update task progress

                     resultUpdate = _spreadManagementService.UpdateSpread(criteria).IsSuccessful && resultUpdate;
                 }

                 return resultUpdate;
             };

            var correctSpreadsCache = GetCorrectSpreadsCache();

            if (correctSpreadsCache != null)
            {
                Task.Factory.StartNew(() => functionUpdateSpread(correctSpreadsCache));
            }

            return Json(taskId, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Progress(Guid id)
        {
            return Json(_uploadTasks.Keys.Contains(id) ? _uploadTasks[id] : 100);
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
                LeagueName = leagueName.TrimStart().TrimEnd() ?? string.Empty,
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

        #region Utilities
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
                AnalyzeInvalidCases(bettypeIds, leagueIds, spreadInfo);

                if (string.IsNullOrEmpty(spreadInfo.Remark))
                {
                    correctSpreads.Enqueue(spreadInfo);
                }
                else
                {
                    errorSpreads.Enqueue(spreadInfo);
                }
            }
        }

        private void AnalyzeInvalidCases(int[] bettypeIds, int[] leagueIds, SpreadChecker spreadInfo)
        {
            if (!IsValidLeague(leagueIds, spreadInfo))
            {
                spreadInfo.Remark += "Invalid league ID";
            }

            if (!IsValidBettype(bettypeIds, spreadInfo))
            {
                if (!string.IsNullOrEmpty(spreadInfo.Remark))
                {
                    spreadInfo.Remark += ", bettype ID";
                }
                else
                {
                    spreadInfo.Remark += "Invalid bettype ID";
                }
            }

            if (!IsValidSpread(spreadInfo))
            {
                if (!string.IsNullOrEmpty(spreadInfo.Remark))
                {
                    spreadInfo.Remark += ", spread";
                }
                else
                {
                    spreadInfo.Remark += "Invalid spread";
                }
            }
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
            int outSpread;

            return int.TryParse(spread.Spread, out outSpread) &&
                    outSpread > AppSettings.SpreadMinValue && outSpread <= AppSettings.SpreadMaxValue;
        }

        private bool IsValidLeague(int[] leagueIds, SpreadChecker spread)
        {
            int outLeagueId;

            return int.TryParse(spread.LeagueId, out outLeagueId) && BinarySearch(leagueIds, outLeagueId);
        }

        private bool IsValidBettype(int[] bettypeIds, SpreadChecker spread)
        {
            int outBettypeId;

            return int.TryParse(spread.BetTypeId, out outBettypeId) && BinarySearch(bettypeIds, outBettypeId);
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
        #endregion
    }
}