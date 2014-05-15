// --------------------------------------------------------------------------
// <copyright file="BenchmarkManagementController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Controllers
{
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.BenchmarkManagement;
    using Fanex.NAP.TGRS.Configuration.Services.BenchmarkManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.BenchmarkManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Resources;

    /// <summary>
    /// Team controller.
    /// </summary>
    public class BenchmarkManagementController : TGRSBaseController
    {
        private IBenchmarkManagementService _benchmarkService;

        public BenchmarkManagementController()
            : this(null)
        {
        }

        public BenchmarkManagementController(IBenchmarkManagementService benchmarkService)
        {
            this._benchmarkService = benchmarkService ?? new BenchmarkManagementService();
            ViewBag.HasEditRight = this.HasRight(TGRSFunctionKeys.BenchmarkManagement, Constant.Policy.Host);
        }

        /// <summary>
        /// Gets Index page.
        /// </summary>
        /// <returns>Return Index View.</returns>
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            List<CountryItem> countries = new List<CountryItem>();
            List<SpecialLeagueItem> specialLeagues = new List<SpecialLeagueItem>();

            countries.Add(new CountryItem
            {
                CountryCode = "null",
                CountryName = ViewLang.AllCountries
            });
            countries.AddRange(this._benchmarkService.GetCountryList());

            specialLeagues.Add(new SpecialLeagueItem
            {
                Code = "0;",
                DisplayName = ViewLang.AllLeagues
            });
            specialLeagues.AddRange(this._benchmarkService.GetSpecialLeagueList());

            ViewBag.Countries = countries;
            ViewBag.SpecialLeagues = specialLeagues;

            return View();
        }

        /// <summary>
        /// Gets the league benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object indicates the league benchmark.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLeagueBenchmark(GetLeagueBenchmarkCriteria criteria)
        {
            IEnumerable<LeagueBenchmarkItem> benchmarks = null;

            criteria.CountryCode = criteria.CountryCode ?? string.Empty;
            criteria.ProgramId = criteria.ProgramId ?? string.Empty;
            criteria.LeagueName = criteria.LeagueName ?? string.Empty;
            benchmarks = this._benchmarkService.GetLeagueBenchmark(criteria);
            benchmarks = benchmarks ?? new List<LeagueBenchmarkItem>();

            return Json(benchmarks);
        }

        /// <summary>
        /// Updates league benchmark.
        /// </summary>
        /// <param name="form">The form that contains updated benchmark value.</param>
        /// <returns>JSON object indicates the league benchmark.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateLeagueBenchmark(UpdatingLeagueBenchmarkForm form)
        {
            IEnumerable<LeagueBenchmarkItem> benchmarks = null;
            ICommandResult updatingResult = this._benchmarkService.UpdateLeagueBenchmark(new UpdateLeagueBenchmarkCriteria
            {
                LeagueId = form.LeagueId,
                Benchmark = form.Benchmark,
                UserId = this.CurrentSession.UserId
            });

            if (updatingResult.IsSuccessful)
            {
                var gettingCriteria = new GetLeagueBenchmarkCriteria
                {
                    SportType = form.SportType,
                    CountryCode = form.CountryCode ?? string.Empty,
                    DisplayMode = form.DisplayMode,
                    ProgramId = form.ProgramId ?? string.Empty,
                    LeagueName = form.LeagueName ?? string.Empty,
                    AllMarket = form.AllMarket
                };

                benchmarks = this._benchmarkService.GetLeagueBenchmark(gettingCriteria);
            }

            return Json(new
            {
                ErrorCode = updatingResult.Code,
                ErrorMessage = updatingResult.Message,
                Benchmarks = benchmarks
            });
        }

        /// <summary>
        /// Gets the league profit margin.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object indicates the league profit margin.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLeagueProfitMargin(GetLeagueProfitMarginCriteria criteria)
        {
            IEnumerable<ProfitMarginItem> profitMargins = null;

            profitMargins = this._benchmarkService.GetProfitMargin(criteria);
            profitMargins = profitMargins ?? new List<ProfitMarginItem>();

            return Json(profitMargins);
        }

        /// <summary>
        /// Gets the team benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object indicates the team benchmark.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamBenchmark(GetTeamBenchmarkCriteria criteria)
        {
            IEnumerable<TeamBenchmarkItem> benchmarks = this._benchmarkService.GetTeamBenchmark(criteria);
            benchmarks = benchmarks ?? new List<TeamBenchmarkItem>();

            return Json(benchmarks);
        }

        /// <summary>
        /// Updates team benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that contain updated benchmark value.</param>
        /// <returns>JSON object indicates the team benchmark.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateTeamBenchmark(UpdateTeamBenchmarkCriteria criteria)
        {
            IEnumerable<TeamBenchmarkItem> benchmarks = null;
            ICommandResult updatingResult = this._benchmarkService.UpdateTeamBenchmark(criteria);

            if (updatingResult.IsSuccessful)
            {
                var gettingCriteria = new GetTeamBenchmarkCriteria();

                benchmarks = this._benchmarkService.GetTeamBenchmark(gettingCriteria);
            }

            return Json(new
            {
                ErrorCode = updatingResult.Code,
                ErrorMessage = updatingResult.Message,
                Benchmarks = benchmarks
            });
        }

        /// <summary>
        /// Gets the league profit margin.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object indicates the league profit margin.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetTeamProfitMargin(GetTeamProfitMarginCriteria criteria)
        {
            IEnumerable<ProfitMarginItem> profitMargins = null;

            profitMargins = this._benchmarkService.GetProfitMargin(criteria);
            profitMargins = profitMargins ?? new List<ProfitMarginItem>();

            return Json(profitMargins);
        }

        /// <summary>
        /// Gets the bet type benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object indicates the bet type benchmark.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetBetTypeBenchmark(GetBetTypeBenchmarkCriteria criteria)
        {
            IEnumerable<BetTypeBenchmarkItem> benchmarks = this._benchmarkService.GetBetTypeBenchmark(criteria);
            benchmarks = benchmarks ?? new List<BetTypeBenchmarkItem>();

            return Json(benchmarks);
        }

        /// <summary>
        /// Updates bet type benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that contain updated benchmark value.</param>
        /// <returns>JSON object indicates the bet type benchmark.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Host)]
        public JsonResult UpdateBetTypeBenchmark(UpdateBetTypeBenchmarkCriteria criteria)
        {
            IEnumerable<BetTypeBenchmarkItem> benchmarks = null;
            ICommandResult updatingResult = this._benchmarkService.UpdateBetTypeBenchmark(criteria);

            if (updatingResult.IsSuccessful)
            {
                var gettingCriteria = new GetBetTypeBenchmarkCriteria
                {
                    LeagueID = criteria.LeagueId
                };

                benchmarks = this._benchmarkService.GetBetTypeBenchmark(gettingCriteria);
            }

            return Json(new
            {
                ErrorCode = updatingResult.Code,
                ErrorMessage = updatingResult.Message,
                Benchmarks = benchmarks
            });
        }

        /// <summary>
        /// Gets the league profit margin.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>JSON object indicates the league profit margin.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = TGRSFunctionKeys.BenchmarkManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetBetTypeProfitMargin(GetBetTypeProfitMarginCriteria criteria)
        {
            IEnumerable<ProfitMarginItem> profitMargins = null;

            profitMargins = this._benchmarkService.GetProfitMargin(criteria);
            profitMargins = profitMargins ?? new List<ProfitMarginItem>();

            return Json(profitMargins);
        }
    }
}