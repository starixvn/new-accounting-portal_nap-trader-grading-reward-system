// -----------------------------------------------------------------------
// <copyright file="SummaryReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class SummaryReportService : TGRSBaseService, ISummaryReportService
    {
        public IEnumerable<GeneralInfo> GetGeneralInfo(GetGeneralInfoCriteria criteria)
        {
            IEnumerable<GeneralInfo> result = null;

            result = this.GetData<GeneralInfo>(criteria);

            return result;
        }

        public IEnumerable<TeamPerformance> GetTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            IEnumerable<TeamPerformance> result = null;

            result = this.GetData<TeamPerformance>(criteria);

            return result;
        }

        public IEnumerable<League> GetTopLoseLeague(GetTopLoseLeagueCriteria criteria)
        {
            IEnumerable<League> result = null;

            result = this.GetData<League>(criteria);

            return result;
        }

        public IEnumerable<TopTrader> GetTopTrader(GetTopTraderCriteria criteria)
        {
            IEnumerable<TopTrader> result = null;

            result = this.GetData<TopTrader>(criteria);

            return result;
        }

        public IEnumerable<League> GetTopWinLeague(GetTopWinLeagueCriteria criteria)
        {
            IEnumerable<League> result = null;

            result = this.GetData<League>(criteria);

            return result;
        }

        /// <summary>
        /// Get trader performance.
        /// </summary>
        /// <param name="criteria">Criteria that used to query trader performance.</param>
        /// <returns>Trader performance model.</returns>
        public IEnumerable<TraderPerformance> GetTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            var result = this.GetData<TraderPerformance>(criteria);

            return result;
        }

        public IEnumerable<BetTypePerformance> GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            IEnumerable<BetTypePerformance> result = null;

            result = this.GetData<BetTypePerformance>(criteria);

            return result;
        }

        /// <summary>
        /// Get grade history.
        /// </summary>
        /// <param name="criteria">Criteria that used to query data.</param>
        /// <returns>List of Grade History Detail Item.</returns>
        public IEnumerable<GradeHistoryDetailItem> GetGradeHistory(GetGradeHistoryCriteria criteria)
        {
            var rawData = this.GetData<GradeHistoryDetail>(criteria);
            IEnumerable<GradeHistoryDetailItem> result = null;

            if (rawData != null && rawData.Any())
            {
                result = rawData.Select(obj => new GradeHistoryDetailItem(obj));
            }
            else
            {
                // empty result, not null
                result = new List<GradeHistoryDetailItem>();
            }

            return result;
        }

        /// <summary>
        /// Get team history.
        /// </summary>
        /// <param name="criteria">Criteria that used to query data.</param>
        /// <returns>List of Team History Detail Item.</returns>
        public IEnumerable<TeamHistoryDetailItem> GetTeamHistory(GetTeamHistoryCriteria criteria)
        {
            var rawData = this.GetData<TeamHistoryDetail>(criteria);
            IEnumerable<TeamHistoryDetailItem> result = null;

            if (rawData != null && rawData.Any())
            {
                result = rawData.Select(obj => new TeamHistoryDetailItem(obj));
            }
            else
            {
                // empty result, not null
                result = new List<TeamHistoryDetailItem>();
            }

            return result;
        }
    }
}