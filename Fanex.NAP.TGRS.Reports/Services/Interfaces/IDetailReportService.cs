// --------------------------------------------------------------------------
// <copyright file="IDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;

    public interface IDetailReportService
    {
        /// <summary>
        /// Gets the bet types.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        IEnumerable<BetTypeItem> GetBetTypes();

        /// <summary>
        /// Gets the league performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>LeaguePerformanceList object.</returns>
        LeaguePerformanceList GetLeaguePerformance(GetLeaguePerformanceCriteria criteria);

        /// <summary>
        /// Gets the trader performance of a league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        TraderPerformanceList GetTraderPerformanceOfLeague(GetTraderPerformanceOfLeagueCriteria criteria);

        /// <summary>
        /// Gets the match performance of a pair of league and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        MatchPerformanceGroup GetMatchPerformanceOfLeagueTrader(GetMatchPerformanceOfLeagueTraderCriteria criteria);

        /// <summary>
        /// Export League Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templateUrl">Path to Excel template file.</param>
        void ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria, string templateUrl);

        /// <summary>
        /// Gets the trader performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        TraderPerformanceList GetTraderPerformance(GetTraderPerformanceCriteria criteria);

        /// <summary>
        /// Gets the match performance of a trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        MatchPerformanceList GetMatchPerformanceOfTrader(GetMatchPerformanceOfTraderCriteria criteria);

        /// <summary>
        /// Export Trader Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templateUrl">Path to Excel template file.</param>
        void ExportTraderPerformance(GetTraderPerformanceCriteria criteria, string templateUrl);

        /// <summary>
        /// Gets the grade performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>GradePerformanceList object.</returns>
        GradePerformanceList GetGradePerformance(GetGradePerformanceCriteria criteria);

        /// <summary>
        /// Export Grade Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templateUrl">Path to Excel template file.</param>
        void ExportGradePerformance(GetGradePerformanceCriteria criteria, string templateUrl);

        /// <summary>
        /// Gets the trader performance of a grade.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        TraderPerformanceList GetTraderPerformanceOfGrade(GetTraderPerformanceOfGradeCriteria criteria);

        /// <summary>
        /// Gets the match performance of a pair of grade and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        MatchPerformanceGroup GetMatchPerformanceOfGradeTrader(GetMatchPerformanceOfGradeTraderCriteria criteria);
    }
}