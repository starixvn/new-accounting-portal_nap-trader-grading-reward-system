// --------------------------------------------------------------------------
// <copyright file="TeamDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using NPOI.SS.UserModel;

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
                // Non live
                var teamPerformanceNonLive = teamData.AsEnumerable()
                                            .Where(c => !c.IsLive)
                                            .Select(c => c);

                // Live
                var teamPerformanceLive = teamData.AsEnumerable()
                                            .Where(c => c.IsLive)
                                            .Select(c => c);

                teamPerformance.AddTeamList(teamPerformanceNonLive, false);
                teamPerformance.AddTeamList(teamPerformanceLive, true);
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
                traderPerformance.AddTraderList(traderData, criteria.IsLive);
                
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
                        leagueGroup.AddMatchList(group, criteria.IsLive);
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
        /// Gets the bet type detail from team report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        public IEnumerable<BetTypeDetailItem> GetBettypeDetailTeam(GetBettypeDetailTeam criteria)
        {
            IEnumerable<BetTypeDetailInfo> bettypeData = this.GetData<BetTypeDetailInfo>(criteria);
            List<BetTypeDetailItem> bettypeDetail = new List<BetTypeDetailItem>();

            if (bettypeData != null && bettypeData.Any())
            {
                GetScoreByPeriodCriteria scoreByPeriodCriteria = new GetScoreByPeriodCriteria
                {
                    FromDate = criteria.FromDate,
                    ToDate = criteria.ToDate,
                    CustId = criteria.CustId,
                    MatchId = criteria.MatchId,
                    Bettypes = string.Join(",", bettypeData.Select(b => b.BetType.ToString())),
                    IsExcludeLeagues = AppSession.IsExcludingLeagues
                };

                IEnumerable<ScoreByPeriodInfo> scoreByPeriodData = this.GetData<ScoreByPeriodInfo>(scoreByPeriodCriteria);
                bettypeDetail = scoreByPeriodData.Any() ? bettypeData.Select(b => new BetTypeDetailItem(b)
                {
                    Score = scoreByPeriodData.Where(s => s.BetType == b.BetType).First().Score,
                    ScoreByPeriod = scoreByPeriodData.Where(s => s.BetType == b.BetType).ToList().Select(i => new ScoreByPeriodItem(i)).ToList()
                }).ToList() : new List<BetTypeDetailItem>();
            }

            return bettypeDetail;
        }

        /// <summary>
        /// Export Team Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        public void ExportTeamPerformance(int userid, GetTeamPerformanceCriteria criteria, string templatePath, bool isViewScore)
        {
            TeamPerformanceList teamData = SessionManager.Get<TeamPerformanceList>(TeamPerformanceDetailReportSessionKey);

            if ((teamData != null) && (teamData.ItemLiveList.Count > 0) || (teamData.ItemNonLiveList.Count > 0))
            {
                string reportName = string.Format(
                                ViewLang.PerformanceDetailFileName,
                                ViewLang.Team,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.TeamPerformance);

                writer.CopyRows(0, 1);
                FilterBlock(userid, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 3);
                FillRowData(teamData, ref writer, isViewScore);
                writer.SyncColumnsWidth(9);

                if (!isViewScore)
                {
                    writer.SetColumnHidden(9);
                }

                writer.Render();
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(TeamPerformanceList contentData, ref ExcelTemplateWriter writer, bool isViewScore)
        {
            // Content rows
            if (contentData.ItemLiveList.Any())
            {
                FillGroupName(ref writer, ViewLang.MarketLive);
                FillGroupRowData(contentData.ItemLiveList, ref writer, isViewScore);
            }

            if (contentData.ItemNonLiveList.Any())
            {
                FillGroupName(ref writer, ViewLang.MarketNonLive);
                FillGroupRowData(contentData.ItemNonLiveList, ref writer, isViewScore);
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
                total.Turnover / total.NoOfMatches,
                total.WinLoss,
                total.BetCount,
                (object)total.Margin ?? ViewLang.NA,
                string.Empty,
            };

            writer.WriteRow(6, totalRecord);
        }

        private void FillGroupRowData(List<TeamPerformanceItem> items, ref ExcelTemplateWriter writer, bool isViewScore)
        {
            var styleIndex = 4;
            var index = 0;

            foreach (var item in items)
            {
                var record = new object[]
                {
                    ++index,
                    item.TeamName,
                    item.NoOfTraders,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.Turnover,
                    item.Turnover / item.NoOfMatches,
                    item.WinLoss,
                    item.BetCount,
                    (object)item.Margin ?? ViewLang.NA,
                    isViewScore ? (object)item.Score ?? ViewLang.NA : ViewLang.NA
                };
                writer.WriteRow(styleIndex, record);
            }
        }

        /// <summary>
        /// Generate team string.
        /// </summary>
        /// <param name="data">List of all teams.</param>
        /// <param name="teamIds">String of criteria's team id.</param>
        /// <returns>Bet type string.</returns>
        private string MakeTeamSelectString(List<TeamItem> data, string teamIds)
        {
            if (teamIds == "0")
            {
                return string.Join(", ", data.Select(obj => obj.TeamName));
            }
            else
            {
                return string.Join(", ", data.Where(obj => teamIds.Contains(obj.TeamId.ToString())).Select(obj => obj.TeamName));
            }
        }

        /// <summary>
        /// Make Filter row.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userid, GetTeamPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(10, 0);
            IFont normalFont = writer.GetFont(11, 0);
            int lineCount = 0;

            var permission = PermissionCheck == null ? Models.Permission.BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);

            List<BetTypeItem> betTypes = this.GetBetTypes(userid, permission).ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.BetTypes);
            string turnoverString = (criteria.Turnover != null) ? criteria.Turnover.Format(2) : string.Empty;
            string winlostString = (criteria.WinLoss != null) ? criteria.WinLoss.Format(2) : string.Empty;
            string marketString = Enum.GetName(typeof(Market), criteria.MarketFilter);

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Market, boldFont, marketString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, betTypeString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumTurnover, boldFont, turnoverString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumWinLoss, boldFont, winlostString, normalFont, "\n");

            //// Margin
            string marginFromString = MinPercentString;
            string marginToString = MaxPercentString;
            if (criteria.MarginFrom != null)
            {
                marginFromString = criteria.MarginFrom.ToString();
            }

            if (criteria.MarginTo != null)
            {
                marginToString = criteria.MarginTo.ToString();
            }

            if (criteria.MarginFrom != null || criteria.MarginTo != null)
            {
                string marginString;
                if (criteria.MarginFrom == null)
                {
                    marginString = string.Format("≤ {0}", criteria.MarginTo);
                }
                else if (criteria.MarginTo == null)
                {
                    marginString = string.Format("≥ {0}", criteria.MarginFrom);
                }
                else
                {
                    marginString = string.Format("from {0} to {1}", marginFromString, marginToString);
                }

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Margin, boldFont, marginString, normalFont, "\n");
            }

            //// Team
            List<TeamItem> teams = this.GetTeams().ToList();
            string teamString = MakeTeamSelectString(teams, criteria.TeamIds);
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Team, boldFont, teamString, normalFont, "\n");

            WriteRowFromRichText(7, contentRender, ref writer);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }
    }
}