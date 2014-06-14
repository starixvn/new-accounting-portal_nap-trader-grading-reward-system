// --------------------------------------------------------------------------
// <copyright file="TeamDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;

    /// <summary>
    /// Detail report service.
    /// </summary>
    public partial class DetailReportService : TGRSBaseService, IDetailReportService
    {
        private const string TeamPerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.TeamPerformance";

        /// <summary>
        /// Gets the teams.
        /// </summary>
        /// <returns>List of TeamItem objects.</returns>
        public IEnumerable<TeamItem> GetTeams()
        {
            var teamData = this.GetData<TeamInfo>(new GetTeamsCriteria());
            IEnumerable<TeamItem> teams = new List<TeamItem>();

            if (teamData.Any())
            {
                teams = teamData.Select(obj => new TeamItem(obj));
            }

            return teams;
        }

        /// <summary>
        /// Gets the team performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TeamPerformanceList object.</returns>
        public TeamPerformanceList GetTeamPerformance(GetTeamPerformanceCriteria criteria)
        {
            IEnumerable<TeamPerformanceInfo> teamData = this.GetData<TeamPerformanceInfo>(criteria);
            TeamPerformanceList teamPerformance = new TeamPerformanceList();

            if (teamData != null && teamData.Any())
            {
                foreach (TeamPerformanceInfo item in teamData)
                {
                    teamPerformance.AddItem(new TeamPerformanceItem(item));
                }

                teamPerformance.Total.Margin = CalculateTotalMargin(teamPerformance.Total.WinLoss, teamPerformance.Total.Turnover);
                SessionManager.Set<TeamPerformanceList>(TeamPerformanceDetailReportSessionKey, teamPerformance);
            }

            return teamPerformance;
        }

        /// <summary>
        /// Gets the trader performance who belongs to a specific team.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformanceOfTeam(GetTraderPerformanceOfTeamCriteria criteria)
        {
            IEnumerable<TraderPerformanceInfo> traderData = this.GetData<TraderPerformanceInfo>(criteria);
            TraderPerformanceList traderPerformance = new TraderPerformanceList();

            if (traderData != null && traderData.Any())
            {
                foreach (TraderPerformanceInfo item in traderData)
                {
                    traderPerformance.AddItem(new TraderPerformanceItem(item));
                }

                traderPerformance.Total.Margin = CalculateTotalMargin(traderPerformance.Total.WinLoss, traderPerformance.Total.Turnover);
            }

            return traderPerformance;
        }

        /// <summary>
        /// Gets the performance data on a match of trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        public MatchPerformanceList GetMatchPerformanceOfTeamTrader(GetMatchPerformanceOfTeamTraderCriteria criteria)
        {
            IEnumerable<MatchPerformanceInfo> matchData = this.GetData<MatchPerformanceInfo>(criteria);
            MatchPerformanceList matchPerformance = new MatchPerformanceList();

            if (matchData != null && matchData.Any())
            {
                IEnumerable<IGrouping<int?, MatchPerformanceInfo>> leagueGroups = matchData.GroupBy(obj => obj.LeagueId);
                MatchPerformanceGroup leagueGroup = null;

                foreach (IGrouping<int?, MatchPerformanceInfo> group in leagueGroups)
                {
                    if (group.Key.HasValue)
                    {
                        leagueGroup = new MatchPerformanceGroup(group.Key);

                        foreach (MatchPerformanceInfo match in group)
                        {
                            leagueGroup.AddItem(new MatchPerformanceItem(match));
                        }

                        leagueGroup.Total.Margin = CalculateTotalMargin(leagueGroup.Total.WinLoss, leagueGroup.Total.Turnover);
                        matchPerformance.AddItem(leagueGroup);
                    }
                }

                matchPerformance.GroupList = matchPerformance.GroupList.OrderBy(obj => obj.LeagueName).ToList();
                matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
                matchPerformance.TotalItems = matchData.Count();
            }

            return matchPerformance;
        }
    }
}