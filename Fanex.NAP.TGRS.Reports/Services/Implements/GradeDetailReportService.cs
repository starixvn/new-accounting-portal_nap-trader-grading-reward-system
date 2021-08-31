// --------------------------------------------------------------------------
// <copyright file="GradeDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.Permission;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    /// <summary>
    /// Detail report service.
    /// </summary>
    public partial class DetailReportService : TGRSBaseService, IDetailReportService
    {
        private const string GradePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.GradePerformance";

        /// <summary>
        /// Gets the grade performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>GradePerformanceList object.</returns>
        public GradePerformanceList GetGradePerformance(GetGradePerformanceCriteria criteria)
        {
            IEnumerable<GradePerformanceInfo> gradeData = this.GetData<GradePerformanceInfo>(criteria);
            GradePerformanceList gradePerformance = new GradePerformanceList();

            if (gradeData != null && gradeData.Any())
            {
                var gradePerformanceNonLive = gradeData.AsEnumerable().Where(c => !c.IsLive).Select(c => c);
                
                var gradePerformanceLive = gradeData.AsEnumerable().Where(c => c.IsLive).Select(c => c);

                gradePerformance.AddGradeList(gradePerformanceNonLive, false);

                gradePerformance.AddGradeList(gradePerformanceLive, true);

                gradePerformance.Total.Margin = CalculateTotalMargin(gradePerformance.Total.WinLoss, gradePerformance.Total.Turnover);

                gradePerformance.Total.MarginReal = CalculateTotalMargin(gradePerformance.Total.WinLossReal, gradePerformance.Total.TurnoverReal);

                SessionManager.Set<GradePerformanceList>(GradePerformanceDetailReportSessionKey, gradePerformance);
            }

            return gradePerformance;
        }

        /// <summary>
        /// Gets the trader performance of a grade.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformanceOfGrade(GetTraderPerformanceOfGradeCriteria criteria)
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

        public TraderPerformanceList GetTraderPerformanceOfGradeByLeague(GetTraderPerformanceOfGradeByLeagueCriteria criteria)
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

        public LeaguePerformanceList GetLeaguePerformanceOfGrade(GetLeaguePerformanceOfGradeCriteria criteria)
        {
            IEnumerable<LeaguePerformanceInfo> leagueData = this.GetData<LeaguePerformanceInfo>(criteria);
            LeaguePerformanceList leaguePerformance = new LeaguePerformanceList();

            if (leagueData != null && leagueData.Any())
            {
                leaguePerformance.AddLeagueList(leagueData, criteria.IsLive);

                leaguePerformance.Total.Margin = CalculateTotalMargin(leaguePerformance.Total.WinLoss, leaguePerformance.Total.Turnover);
                leaguePerformance.Total.MarginReal = CalculateTotalMargin(leaguePerformance.Total.WinLossReal, leaguePerformance.Total.TurnoverReal);

                SessionManager.Set<LeaguePerformanceList>(LeaguePerformanceDetailReportSessionKey, leaguePerformance);
            }

            return leaguePerformance;
        }

        /// <summary>
        /// Gets the match performance of a pair of grade and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        public MatchPerformanceList GetMatchPerformanceOfGradeTrader(GetMatchPerformanceOfGradeTraderCriteria criteria)
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
        /// Gets the bet type detail from grade report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        public IEnumerable<BetTypeDetailItem> GetBettypeDetailGrade(GetBettypeDetailGradeCriteria criteria)
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
        /// Export Grade Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        public void ExportGradePerformance(int userId, GetGradePerformanceCriteria criteria, string templatePath, bool isViewScore)
        {
            GradePerformanceList gradeData = SessionManager.Get<GradePerformanceList>(GradePerformanceDetailReportSessionKey);

            if ((gradeData != null) && (gradeData.ItemLiveList.Any() || gradeData.ItemNonLiveList.Any()))
            {
                string reportName = string.Format(
                                    ViewLang.PerformanceDetailFileName,
                                    ViewLang.Grade,
                                    criteria.FromDate.ToShortFormatedDateForFileName(),
                                    criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.GradePerformance);

                writer.CopyRows(0, 1);

                FilterBlock(userId, criteria, ref writer);

                var rowHeader = writer.CopyRows(3, 2);

                //writer.FreezeRow(0, 3);

                FillRowData(gradeData, ref writer, isViewScore, criteria);

                if (!criteria.IsVirtual && criteria.IsReal)
                {
                    var cellHeader = rowHeader.GetCell(7);

                    cellHeader.SetCellValue("Real");
                }                

                if (criteria.IsVirtual && criteria.IsReal)
                    writer.SyncColumnsWidth(15);
                else
                    writer.SyncColumnsWidth(11);

                if (!isViewScore)
                {
                    writer.SetColumnHidden(6);
                }

                writer.Render();
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(GradePerformanceList contentData, ref ExcelTemplateWriter writer, bool isViewScore, GetGradePerformanceCriteria criteria)
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
            GradePerformanceItem total = contentData.Total;          

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

        private void FillGroupName(ref ExcelTemplateWriter writer, string groupName)
        {
            var contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(12, 0);
            TextBlock nameBlock = new TextBlock(groupName, boldFont);
            contentRender = contentRender.AddText(nameBlock);

            WriteRowFromRichText(6, contentRender, ref writer);
        }

        private void FillGroupRowData(List<GradePerformanceItem> items, ref ExcelTemplateWriter writer, bool isViewScore, GetGradePerformanceCriteria criteria)
        {
            var styleIndex = 5;
            var index = 0;

            foreach (var item in items)
            {
                var record = new List<object>
                {
                    ++index,
                    item.Grade,
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
        /// Make Filter row.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userId, GetGradePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            var permission = (PermissionCheck == null) ? BettypeViewPermission.All : ReportUtil.GetBettypePermission(PermissionCheck);
            List<BetTypeItem> betTypes = this.GetBetTypes(userId, permission).ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.BetTypes);           
            string marketString = criteria.Market == -1 ? ViewLang.MarketAll : (criteria.Market == 1 ? ViewLang.MarketLive : ViewLang.MarketNonLive);
            var leagueGroupNameString = MakeLeagueGroupSelectString(criteria.LeagueGroupIds);

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

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, leagueGroupNameString, normalFont, "\n");
            
            WriteRowFromRichText(8, contentRender, ref writer);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private void WriteRowFromRichText(int rowIndex, RichTextRender contentRender, ref ExcelTemplateWriter writer)
        {
            var contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(rowIndex, contentRichTextArray);
        }
    }
}