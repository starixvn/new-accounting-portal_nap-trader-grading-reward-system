// -----------------------------------------------------------------------
// <copyright file="SummaryReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services.Implement.SummaryReport
{
    using System.Collections;
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Repositories.Implements;
    using Fanex.NAP.TGRS.Reports.Repositories.Interface;
    using Fanex.NAP.TGRS.Reports.Services.Interface.SummaryReport;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class SummaryReportService : TGRSBaseService, ISummaryReportService
    {
        private readonly ISummaryReportRepository _summaryReportRepository;

        public SummaryReportService() :
            this(null)
        {
        }

        public SummaryReportService(ISummaryReportRepository summaryReportRepository)
        {
            this._summaryReportRepository = summaryReportRepository ?? new SummaryReportRepository();
        }

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
        public TraderPerformance GetTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            TraderPerformance result = this._summaryReportRepository.GetTraderPerformance(criteria);

            return result;
        }

        public IEnumerable<BetTypePerformance> GetBetTypePerformance(GetBetTypePerformanceCriteria criteria)
        {
            IEnumerable<BetTypePerformance> result = null;

            result = this.GetData<BetTypePerformance>(criteria);

            return result;
        }

        public GradeHistory GetGradeHistory(GetGradeHistoryCriteria criteria)
        {
            GradeHistory result = this._summaryReportRepository.GetGradeHistory(criteria);

            return result;
        }

        public TeamHistory GetTeamHistory(GetTeamHistoryCriteria criteria)
        {
            TeamHistory result = this._summaryReportRepository.GetTeamHistory(criteria);

            return result;
        }
    }
}
