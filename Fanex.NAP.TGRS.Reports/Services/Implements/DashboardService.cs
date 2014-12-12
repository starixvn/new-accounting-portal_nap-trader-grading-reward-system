// -----------------------------------------------------------------------
// <copyright file="DashboardService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.12.10">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.GetSummaryInfoCriteria;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Dashboard;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.ViewModels.Dashboard;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class DashboardService : TGRSBaseService, IDashboardService
    {
        /// <summary>
        /// Gets the general information.
        /// </summary>
        /// <returns>General info list.</returns>
        public IEnumerable<GeneralInfo> GetGeneralInfo()
        {
            IEnumerable<GeneralInfo> result = null;

            var summaryCriteria = new GetGeneralInfoCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, 1, 1),
                ToDate = DateTime.Now
            };
            result = this.GetData<GeneralInfo>(summaryCriteria);

            return result;
        }

        /// <summary>
        /// Gets the top win league.
        /// </summary>
        /// <returns>List of league.</returns>
        public IEnumerable<League> GetTopWinLeague()
        {
            var topLeagueCriteria = new GetTopWinLeagueCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, 1, 1),
                ToDate = DateTime.Now
            };

            IEnumerable<League> result = this.GetData<League>(topLeagueCriteria);

            result = result.Take(5);

            return result;
        }

        /// <summary>
        /// Gets the top trader.
        /// </summary>
        /// <returns>List Top Trader.</returns>
        public IEnumerable<TopTrader> GetTopTrader()
        {
            var topTraderCriteria = new GetTopTraderCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, 1, 1),
                ToDate = DateTime.Now,
                Top = 5,
                IsBottom = 0
            };

            IEnumerable<TopTrader> result = this.GetData<TopTrader>(topTraderCriteria);

            return result;
        }

        /// <summary>
        /// Gets the top bet type.
        /// </summary>
        /// <returns>List Bet type.</returns>
        public IEnumerable<BetTypePerformance> GetTopBettype()
        {
            var topBettypeCriteria = new GetBetTypePerformanceCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, 1, 1),
                ToDate = DateTime.Now
            };

            IEnumerable<BetTypePerformance> result = this.GetData<BetTypePerformance>(topBettypeCriteria);

            return result;
        }

        /// <summary>
        /// Gets the summary data.
        /// </summary>
        /// <returns>List Month Items.</returns>
        public IEnumerable<MonthAmountItem> GetSummaryData()
        {
            var summaryCriteria = new GetSummaryInfoCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, 1, 1),
                ToDate = DateTime.Now
            };

            List<MonthAmount> rawData = this.GetData<MonthAmount>(summaryCriteria).ToList();

            var result = new List<MonthAmountItem>();
            foreach (var item in rawData)
            {
                var monthItem = new MonthAmountItem(item);
                result.Add(monthItem);
            }

            return result;
        }

        /// <summary>
        /// Gets the team data.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>List of team performance.</returns>
        public IEnumerable<TeamPerformance> GetTeamData(int month)
        {
            var beginDate = new DateTime(DateTime.Now.Year, month, 1);
            var endDate = new DateTime(DateTime.Now.Year, month, DateTime.DaysInMonth(beginDate.Year, beginDate.Month));

            var teamCriteria = new GetTeamPerformanceCriteria
            {
                ReportType = 2,
                FromDate = beginDate,
                ToDate = endDate
            };

            IEnumerable<TeamPerformance> teamData = this.GetData<TeamPerformance>(teamCriteria);

            return teamData;
        }
    }
}