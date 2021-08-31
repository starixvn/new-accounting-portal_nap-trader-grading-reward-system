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
                teamPerformance.Total.MarginReal = CalculateTotalMargin(teamPerformance.Total.WinLossReal, teamPerformance.Total.TurnoverReal);

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
                traderPerformance.Total.MarginReal = CalculateTotalMargin(traderPerformance.Total.WinLossReal, traderPerformance.Total.TurnoverReal);
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
                        leagueGroup.Total.MarginReal = CalculateTotalMargin(leagueGroup.Total.WinLossReal, leagueGroup.Total.TurnoverReal);
                        matchPerformance.AddItem(leagueGroup);
                    }
                }

                matchPerformance.GroupList = matchPerformance.GroupList.OrderBy(obj => obj.LeagueName).ToList();
                matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
                matchPerformance.GrandTotal.MarginReal = CalculateTotalMargin(matchPerformance.GrandTotal.WinLossReal, matchPerformance.GrandTotal.TurnoverReal);
                matchPerformance.TotalItems = matchData.Count();
            }

            return matchPerformance;
        }

        /// <summary>
        /// Gets the bet type detail from team report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        public IEnumerable<BetTypeDetailItem> GetBettypeDetailTeam(GetBettypeDetailTeamCriteria criteria)
        {
            IEnumerable<BetTypeDetailInfo> bettypeData = this.GetData<BetTypeDetailInfo>(criteria);
            List<BetTypeDetailItem> bettypeDetail = new List<BetTypeDetailItem>();

            if (bettypeData != null && bettypeData.Any())
            {
                if (criteria.IsLive)
                {
                    GetScoreByPeriodCriteria scoreByPeriodCriteria = new GetScoreByPeriodCriteria
                    {
                        FromDate = criteria.FromDate,
                        ToDate = criteria.ToDate,
                        CustId = criteria.CustId,
                        MatchId = criteria.MatchId,
                        Bettypes = string.Join(",", bettypeData.Select(b => b.BetType.ToString())),
                        IsExcludeLeagues = AppSession.IsExcludingLeagues,
                        LeagueGroupIds = criteria.LeagueGroupIds
                    };

                    IEnumerable<ScoreByPeriodInfo> scoreByPeriodData = this.GetData<ScoreByPeriodInfo>(scoreByPeriodCriteria);
                    bettypeDetail = scoreByPeriodData.Any() ? bettypeData.Select(b => new BetTypeDetailItem(b)
                    {
                        Score = scoreByPeriodData.Where(s => s.BetType == b.BetType).First().Score,
                        ScoreByPeriod = scoreByPeriodData.Where(s => s.BetType == b.BetType).ToList().Select(i => new ScoreByPeriodItem(i)).ToList()
                    }).ToList() : new List<BetTypeDetailItem>();
                }
                else
                {
                    bettypeDetail = bettypeData.Select(b => new BetTypeDetailItem(b)
                    {
                        Score = null,
                        ScoreByPeriod = new List<ScoreByPeriodItem>()
                    }).ToList();
                }
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
             
                //writer.FreezeRow(0, 3);

                var rowHeader = writer.CopyRows(3, 2);

                if (!criteria.IsVirtual && criteria.IsReal)
                {
                    var cellHeader = rowHeader.GetCell(7);

                    cellHeader.SetCellValue("Real");
                }

                FillRowData(teamData, ref writer, isViewScore, criteria);

                writer.SyncColumnsWidth(15);

                if (!isViewScore)
                {
                    writer.SetColumnHidden(7);
                }

                writer.Render();
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(TeamPerformanceList contentData, ref ExcelTemplateWriter writer, bool isViewScore, GetTeamPerformanceCriteria criteria)
        {
            // Content rows
            if (contentData.ItemLiveList.Any())
            {
                FillGroupName(ref writer, ViewLang.MarketLive);
                FillGroupRowData(contentData.ItemLiveList, ref writer, isViewScore, criteria);
            }

            if (contentData.ItemNonLiveList.Any())
            {
                FillGroupName(ref writer, ViewLang.MarketNonLive);
                FillGroupRowData(contentData.ItemNonLiveList, ref writer, isViewScore, criteria);
            }

            // Total row
            TeamPerformanceItem total = contentData.Total;           

            var record = new List<object>
                {
                    ViewLang.GrandTotal,
                    null,
                    total.NoOfTraders,
                    total.NoOfLeagues,
                    total.NoOfMatches,
                    total.BetCount,
                    string.Empty
                };

            if (criteria.IsVirtual)
            {
                record.AddRange(new object[] {
                        total.Turnover,
                        total.NoOfMatches != 0 ? (object)(total.Turnover / total.NoOfMatches) : ViewLang.NA,
                        total.WinLoss,
                        (object)total.Margin ?? ViewLang.NA
                    });
            }

            if (criteria.IsReal)
            {
                record.AddRange(new object[] {
                        total.TurnoverReal,                       
                        total.NoOfMatches != 0 ? (object)(total.TurnoverReal / total.NoOfMatches) : ViewLang.NA,
                        total.WinLossReal,
                        (object)total.MarginReal ?? ViewLang.NA
                    });
            }

            writer.WriteRow(7, record.ToArray());
        }

        private void FillGroupRowData(List<TeamPerformanceItem> items, ref ExcelTemplateWriter writer, bool isViewScore, GetTeamPerformanceCriteria criteria)
        {
            var styleIndex = 5;
            var index = 0;

            foreach (var item in items)
            {
                var record = new List<object>
                {
                    ++index,
                    item.TeamName,
                    item.NoOfTraders,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.BetCount,
                    isViewScore ? (object)item.Score ?? ViewLang.NA : ViewLang.NA
                };

                if (criteria.IsVirtual)
                {
                    record.AddRange(new object[] {
                        item.Turnover,
                        item.NoOfMatches != 0 ? (object)(item.Turnover / item.NoOfMatches) : ViewLang.NA,
                        item.WinLoss,
                        (object)item.Margin ?? ViewLang.NA
                    });
                }

                if (criteria.IsReal)
                {
                    record.AddRange(new object[] {
                        item.TurnoverReal,
                        item.NoOfMatches != 0 ? (object)(item.TurnoverReal / item.NoOfMatches) : ViewLang.NA,
                        item.WinLossReal,
                        (object)item.MarginReal ?? ViewLang.NA
                    });
                }

                writer.WriteRow(styleIndex, record.ToArray());
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
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            var permission = PermissionCheck == null ? Models.Permission.BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);

            List<BetTypeItem> betTypes = this.GetBetTypes(userid, permission).ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.BetTypes);         
            string marketString = criteria.Market == -1 ? ViewLang.MarketAll : (criteria.Market == 1 ? ViewLang.MarketLive : ViewLang.MarketNonLive);
            
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Market, boldFont, marketString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, betTypeString, normalFont, "\n");

            if (criteria.IsVirtual)
            {
                string turnoverString = (criteria.Turnover != null) ? criteria.Turnover.Format(2) : string.Empty;
                string winlostString = (criteria.WinLoss != null) ? criteria.WinLoss.Format(2) : string.Empty;
               
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumVirtualTurnover, boldFont, turnoverString, normalFont, "\n");               
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumVirtualWinLoss, boldFont, winlostString, normalFont, "\n");

                if (criteria.MarginFrom != null || criteria.MarginTo != null)
                {
                    var marginString = GenerateMarginString(criteria.MarginFrom, criteria.MarginTo);
                    
                    AppendBlockContent(ref contentRender, ref lineCount, ViewLang.VirtualMargin, boldFont, marginString, normalFont, "\n");
                }
            }

            if (criteria.IsReal)
            {
                string realTurnoverString = (criteria.TurnoverReal != null) ? criteria.TurnoverReal.Format(2) : string.Empty;
                string realWinlostString = (criteria.WinLossReal != null) ? criteria.WinLossReal.Format(2) : string.Empty;
                
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumRealTurnover, boldFont, realTurnoverString, normalFont, "\n");               
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumRealWinLoss, boldFont, realWinlostString, normalFont, "\n");

                if (criteria.MarginFromReal != null || criteria.MarginToReal != null)
                {
                    var marginString = GenerateMarginString(criteria.MarginFromReal, criteria.MarginToReal);
                                        
                    AppendBlockContent(ref contentRender, ref lineCount, ViewLang.RealMargin, boldFont, marginString, normalFont, "\n");
                }
            }

            var leagueGroupNameString = MakeLeagueGroupSelectString(criteria.LeagueGroupIds);

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, leagueGroupNameString, normalFont, "\n");
            
            List<TeamItem> teams = this.GetTeams().ToList();
            string teamString = MakeTeamSelectString(teams, criteria.TeamIds);
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Team, boldFont, teamString, normalFont, "\n");

            WriteRowFromRichText(8, contentRender, ref writer);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }
    }
}