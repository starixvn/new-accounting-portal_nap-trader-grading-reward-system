namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.GetSummaryInfoCriteria;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Dashboard;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.ViewModels.Dashboard;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class DashboardService : TGRSBaseService, IDashboardService
    {

        public bool IsExcludeLeagueStatus;

        public DashboardService(bool isExcludeLeague)
        {
            IsExcludeLeagueStatus = isExcludeLeague;
        }

        /// <summary>
        /// Gets the general information.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// General info list.
        /// </returns>
        public IEnumerable<GeneralInfo> GetGeneralInfo(int month, int permission)
        {
            IEnumerable<GeneralInfo> result = null;

            var summaryCriteria = new GetGeneralInfoCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };
            result = this.GetData<GeneralInfo>(summaryCriteria);

            return result;
        }

        /// <summary>
        /// Gets the top win league.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// List of league.
        /// </returns>
        public IEnumerable<League> GetTopWinLeague(int month, int permission)
        {
            var topLeagueCriteria = new GetTopWinLeagueCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            IEnumerable<League> result = this.GetData<League>(topLeagueCriteria);

            result = result.Take(5);

            return result;
        }

        /// <summary>
        /// Gets the top trader.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// List Top Trader.
        /// </returns>
        public IEnumerable<TopTrader> GetTopTrader(int month, int permission)
        {
            var topTraderCriteria = new GetTopTraderCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                Top = 5,
                IsBottom = 0,
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            IEnumerable<TopTrader> result = this.GetData<TopTrader>(topTraderCriteria);

            return result;
        }

        /// <summary>
        /// Gets the top bet type.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// List Bet type.
        /// </returns>
        public IEnumerable<BetTypePerformance> GetTopBettype(int month, int permission)
        {
            var topBettypeCriteria = new GetBetTypePerformanceCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            IEnumerable<BetTypePerformance> result = this.GetData<BetTypePerformance>(topBettypeCriteria);

            return result.Take(10);
        }

        /// <summary>
        /// Gets the summary data.
        /// </summary>
        /// <param name="month">The month.</param>
        /// <returns>
        /// List Month Items.
        /// </returns>
        public IEnumerable<MonthAmountItem> GetSummaryData(int month, int permission)
        {
            var summaryCriteria = new GetSummaryInfoCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            List<MonthAmount> rawData = this.GetData<MonthAmount>(summaryCriteria).ToList();
            rawData = rawData.OrderBy(x => x.EventDate).ToList();

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
        public IEnumerable<TeamPerformance> GetTeamData(int month, int permission)
        {
            var teamCriteria = new GetTeamPerformanceCriteria
            {
                ReportType = 2,
                FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - month),
                ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month)),
                ViewPermission = permission,
                IsExcludeLeagues = IsExcludeLeagueStatus
            };

            IEnumerable<TeamPerformance> teamData = this.GetData<TeamPerformance>(teamCriteria);

            return teamData;
        }
    }
}