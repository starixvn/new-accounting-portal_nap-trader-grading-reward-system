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
            List<LeagueBenchmarkItem> benchmarks = new List<LeagueBenchmarkItem>();

            criteria.CountryCode = criteria.CountryCode ?? string.Empty;
            criteria.ProgramId = criteria.ProgramId ?? string.Empty;
            criteria.LeagueName = criteria.LeagueName ?? string.Empty;
            benchmarks.AddRange(this._benchmarkService.GetLeagueBenchmark(criteria));

            return Json(benchmarks);
        }
    }
}