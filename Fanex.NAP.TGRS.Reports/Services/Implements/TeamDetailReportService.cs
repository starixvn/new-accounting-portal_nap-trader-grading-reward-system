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
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
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

        /// <summary>
        /// Export Team Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templateUrl">Path to Excel template file.</param>
        public void ExportTeamPerformance(GetTeamPerformanceCriteria criteria, string templateUrl)
        {
            TeamPerformanceList teamData = SessionManager.Get<TeamPerformanceList>(TeamPerformanceDetailReportSessionKey);

            if ((teamData != null) && (teamData.ItemList.Count > 0))
            {
                string reportName = string.Format(
                                ViewLang.PerformanceDetailFileName,
                                ViewLang.Team,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templateUrl, reportName, ViewLang.TeamPerformance);
                writer.CopyRows(0, 4);

                // Write content.
                FillRowData(teamData, ref writer);

                writer.SyncColumnsWidth(10);
                writer.Render();
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(TeamPerformanceList contentData, ref ExcelTemplateWriter writer)
        {
            // Content rows
            int len = contentData.ItemList.Count;
            TeamPerformanceItem item;

            for (int i = 0; i < len; i++)
            {
                int styleIndex = (i % 2 == 0) ? 4 : 5;
                item = contentData.ItemList[i];

                var record = new object[]
                {
                    i + 1,
                    item.TeamName,
                    item.NoOfTraders,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.Turnover,
                    item.WinLoss,
                    item.BetCount,
                    item.Margin,
                    item.TeamBM
                };
                writer.WriteRow(styleIndex, record);
            }

            // Total row
            TeamPerformanceItem total = contentData.Total;
            var totalRecord = new object[]
            {
                ViewLang.GrandTotal,
                null,
                total.NoOfTraders,
                total.NoOfLeagues,
                total.NoOfMatches,
                total.Turnover,
                total.WinLoss,
                total.BetCount,
                (object)total.Margin ?? ViewLang.NA,
                null
            };
            writer.WriteRow(6, totalRecord);
        }
    }
}