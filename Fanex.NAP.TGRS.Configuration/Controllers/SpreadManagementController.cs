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
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Web;
    using System.Web.Mvc;
    using Core.BaseClasses;
    using Core.ExcelUtility;
    using Core.ExcelUtility.DefaultImplementation;
    using Core.Helpers;
    using Criteria.SpreadManagement;
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
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.SpreadManagement, Constant.Policy.Host);
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
            var correctSpreads = new Queue<SpreadInfo>();
            var errorSpreads = new Queue<SpreadChecker>();
            
            var totalSpreads = ValidateSpreads(spreads, correctSpreads, errorSpreads);

            CacheCorrectSpreads(correctSpreads);

            var spreadValidation = new SpreadValidation() { ErrorSpreads = errorSpreads, TotalSpreads = totalSpreads };
            return Json(spreadValidation, JsonRequestBehavior.AllowGet);
        }

        private static void CacheCorrectSpreads(Queue<SpreadInfo> correctSpreads)
        {
            if (correctSpreads.Count > 0)
            {
                var currentUser = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
                CacheManager.Set<IEnumerable<SpreadInfo>>(currentUser.ToString() + "_Spreads", correctSpreads);
            }
        }

        private int ValidateSpreads(IEnumerable<SpreadChecker> spreads, Queue<SpreadInfo> correctSpreads, Queue<SpreadChecker> errorSpreads)
        {
            var total = 0;
            var bettypeIds = _spreadManagementService.GetBettypeIdsList().Select(x => x.BetType);
            var leagueIds = _spreadManagementService.GetLeagueIdsList().Select(x => x.LeagueId);

            foreach (var spreadInfo in spreads)
            {
                total++;
                if ((SpreadInfo)spreadInfo == null)
                {                    
                    errorSpreads.Enqueue(spreadInfo);
                }
                else
                {
                    if (bettypeIds.Contains<int>(int.Parse(spreadInfo.BetTypeId)) && leagueIds.Contains<int>(int.Parse(spreadInfo.LeagueId)))
                    {
                        correctSpreads.Enqueue((SpreadInfo)spreadInfo);
                    }
                    else
                    {                        
                        errorSpreads.Enqueue(spreadInfo);
                    }
                }
            }

            return total;
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
        public ActionResult UpdateSpread(UpdateSpreadCriteria criteria)
        {
            var currentUser = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            var correctSpreadsCache = CacheManager.Get<IEnumerable<SpreadInfo>>(currentUser.ToString() + "_Spreads");

            criteria.CreatorId = AppSession.CurrentUser != null ? AppSession.CurrentUser.Id : 0;
            criteria.SpreadDoc = correctSpreadsCache != null ? CreateXmlParamForInsertingSuspiciousInfo(correctSpreadsCache) : string.Empty;

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

        [HttpGet]
        [NapAuth(FunctionKey = TGRSFunctionKeys.SpreadManagement, Policy = Constant.Policy.Read)]
        public ActionResult GetHostPermission()
        {
            return Json(PermissionService.HasHostPermission(TGRSFunctionKeys.SpreadManagement), JsonRequestBehavior.AllowGet);
        }
        
        private string CreateXmlParamForInsertingSuspiciousInfo(IEnumerable<SpreadInfo> spreads)
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
    }
}