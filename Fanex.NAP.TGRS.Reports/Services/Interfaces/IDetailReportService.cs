// --------------------------------------------------------------------------
// <copyright file="IDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>
namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.Permission;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;

    public interface IDetailReportService
    {
        /// <summary>
        ///  Gets bet types by permissions
        /// </summary>
        /// <param name="permission">permission on bettype</param>
        /// <returns></returns>
        IEnumerable<BetTypeItem> GetBetTypes(int userid, BettypeViewPermission permission = BettypeViewPermission.All);

        IEnumerable<GroupBetTypes> GetGroupBetTypes(int userid, BettypeViewPermission permission = BettypeViewPermission.All);

        IEnumerable<LeagueGroup> GetLeagueGroups();

        /// <summary>
        /// Gets the bet types from session.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        IEnumerable<BetTypeItem> GetBetTypesFromSession(int userid);

        /// <summary>
        /// Gets the league performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>LeaguePerformanceList object.</returns>
        LeaguePerformanceList GetLeaguePerformance(Fanex.Data.Repository.ICriteria criteria, bool isGroupOfLeague = false);

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
        /// Gets the bet type detail from league report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        IEnumerable<BetTypeDetailItem> GetBettypeDetailLeague(GetBettypeDetailLeague criteria);

        /// <summary>
        /// Gets the match performance of league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        MatchPerformanceGroup GetMatchPerformanceOfLeague(GetMatchPerformanceOfLeagueCriteria criteria);

        /// <summary>
        /// Gets the bettype performance of a pair of league and match.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        IEnumerable<BetTypeDetailItem> GetBettypePerformanceOfLeagueMatch(GetBetTypePerformanceOfLeagueMatchCriteria criteria);

        /// <summary>
        /// Export League Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        void ExportLeaguePerformance(int userid, GetLeaguePerformanceCriteria criteria, string templatePath);

        /// <summary>
        /// Gets the trader performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        TraderPerformanceList GetTraderPerformance(Fanex.Data.Repository.ICriteria criteria);

        /// <summary>
        /// Gets the match performance of a trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        MatchPerformanceList GetMatchPerformanceOfTrader(Fanex.Data.Repository.ICriteria criteria);

        /// <summary>
        /// Gets the bet type detail from trader report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        IEnumerable<BetTypeDetailItem> GetBettypeDetailTrader(GetBettypeDetailTrader criteria);

        /// <summary>
        /// Export Trader Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        void ExportTraderPerformance(int userId, GetTraderPerformanceCriteria criteria, string templatePath, bool isViewScore);

        /// <summary>
        /// Gets the grade performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>GradePerformanceList object.</returns>
        GradePerformanceList GetGradePerformance(GetGradePerformanceCriteria criteria);

        /// <summary>
        /// Gets the bet type detail from grade report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        IEnumerable<BetTypeDetailItem> GetBettypeDetailGrade(GetBettypeDetailGradeCriteria criteria);

        /// <summary>
        /// Export Grade Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        void ExportGradePerformance(int userId, GetGradePerformanceCriteria criteria, string templatePath, bool isViewScore);

        /// <summary>
        /// Gets the trader performance of a grade.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        TraderPerformanceList GetTraderPerformanceOfGrade(GetTraderPerformanceOfGradeCriteria criteria);

        TraderPerformanceList GetTraderPerformanceOfGradeByLeague(GetTraderPerformanceOfGradeByLeagueCriteria criteria);

        /// <summary>
        /// Gets the match performance of a pair of grade and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        MatchPerformanceList GetMatchPerformanceOfGradeTrader(GetMatchPerformanceOfGradeTraderCriteria criteria);

        /// <summary>
        /// Gets the teams.
        /// </summary>
        /// <returns>List of TeamItem objects.</returns>
        IEnumerable<TeamItem> GetTeams();

        /// <summary>
        /// Gets the team performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TeamPerformanceList object.</returns>
        TeamPerformanceList GetTeamPerformance(GetTeamPerformanceCriteria criteria);

        /// <summary>
        /// Gets the trader performance who belongs to a specific team.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        TraderPerformanceList GetTraderPerformanceOfTeam(GetTraderPerformanceOfTeamCriteria criteria);

        /// <summary>
        /// Gets the performance data on a match of trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        MatchPerformanceList GetMatchPerformanceOfTeamTrader(GetMatchPerformanceOfTeamTraderCriteria criteria);

        /// <summary>
        /// Gets the bet type detail from team report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        IEnumerable<BetTypeDetailItem> GetBettypeDetailTeam(GetBettypeDetailTeamCriteria criteria);

        /// <summary>
        /// Export Team Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        void ExportTeamPerformance(int userid, GetTeamPerformanceCriteria criteria, string templatePath, bool isViewScore);

        /// <summary>
        /// Gets the bet type performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>BetTypePerformanceList object.</returns>
        BetTypePerformanceList GetBetTypePerformance(GetBetTypePerformanceCriteria criteria);

        /// <summary>
        /// Gets the trader performance of a bet type.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        TraderPerformanceList GetTraderPerformanceOfBetType(GetTraderPerformanceOfBetTypeCriteria criteria);

        BetTypeBetChoiceList GetBetTypeBetChoicePerformance(GetBetChoicePerformanceOfBetTypeCriteria criteria);

        /// <summary>
        /// Gets the match performance of a pair of bet type and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        MatchPerformanceList GetMatchPerformanceOfBetTypeTrader(GetMatchPerformanceOfBetTypeTraderCriteria criteria);

        /// <summary>
        /// Gets the league performance of bet type.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>LeaguePerformanceList object.</returns>
        LeaguePerformanceList GetLeaguePerformanceOfBetType(GetLeaguePerformanceOfBetTypeCriteria criteria);

        LeaguePerformanceList GetLeaguePerformanceOfBetChoice(GetLeaguePerformanceOfBetChoiceCriteria criteria);

        LeaguePerformanceList GetLeaguePerformanceOfGrade(GetLeaguePerformanceOfGradeCriteria criteria);

        /// <summary>
        /// Gets the trader performance of a bet type, league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        TraderPerformanceList GetTraderPerformanceOfBetTypeLeague(GetTraderPerformanceOfBetTypeLeagueCriteria criteria);

        BetTypeBetChoiceList GetBetChoicePerformanceOfBetTypeLeague(GetBetChociePerformanceOfBetTypeLeagueCriteria criteria);

        IEnumerable<IntervalBetChoicePerformanceInfo> GetIntervalPerformanceOfBetTypeLeagueBetChoice(GetIntervalPerformanceOfBetTypeLeagueBetChoiceCriteria criteria);

        IEnumerable<IntervalBetChoicePerformanceInfo> GetIntervalPerformanceOfBetTypeBetChoice(GetIntervalPerformanceOfBetTypeBetChoiceCriteria criteria);

        PointHDPPerformanceList GetPointHDPPerformanceOfBetTypeBetChoice(GetPointHDPPerformanceOfBetTypeBetChoiceCriteria criteria);

        LeaguePerformanceList GetLeaguePerformanceOfBetTypeBetChoicePointHDP(GetLeagueOfBetTypeBetChoicePointHDPCriteria criteria);

        /// <summary>
        /// Gets the match performance of bet type, league and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        MatchPerformanceGroup GetMatchPerformanceOfBetTypeLeagueTrader(GetMatchPerformanceOfBetTypeLeagueTraderCriteria criteria);

        /// <summary>
        /// Export Bet Type Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        void ExportBetTypePerformance(int userid, GetBetTypePerformanceCriteria criteria, string templatePath);
    }
}