// --------------------------------------------------------------------------
// <copyright file="LeagueDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
//   <change who="Ken.Nguyen" date="2014.6.12">Add Excel export</change>
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
        private const string LeaguePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.LeaguePerformance";
        private const string DefaultBettypeSessionKey = "Fanex.NAP.TGRS.Reports.DefaultBettype";
        private const int PointInPixel = 225;
        private const string MinPercentString = "min";
        private const string MaxPercentString = "max";

        /// <summary>
        /// Gets the bet types.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        public IEnumerable<BetTypeItem> GetBetTypes()
        {
            List<BetTypeItem> betTypes = null;
            var criteria = new GetBetTypesCriteria();
            IEnumerable<BetTypeInfo> data = this.GetData<BetTypeInfo>(criteria);

            if (data != null && data.Any())
            {
                betTypes = data.Select(obj => new BetTypeItem(obj)).ToList();
            }

            SessionManager.Set<List<BetTypeItem>>(DefaultBettypeSessionKey, betTypes);
            return betTypes;
        }

        /// <summary>
        /// Gets the bet types from session.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        public IEnumerable<BetTypeItem> GetBetTypesFromSession()
        {
            var betTypes = SessionManager.Get<List<BetTypeItem>>(DefaultBettypeSessionKey);
            if (betTypes == null)
            {
                betTypes = this.GetBetTypes().ToList();
            }

            return betTypes;
        }

        /// <summary>
        /// Gets the league performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>LeaguePerformanceList object.</returns>
        public LeaguePerformanceList GetLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            IEnumerable<LeaguePerformanceInfo> leagueData = this.GetData<LeaguePerformanceInfo>(criteria);
            LeaguePerformanceList leaguePerformance = new LeaguePerformanceList();

            if (leagueData != null && leagueData.Any())
            {
                foreach (LeaguePerformanceInfo item in leagueData)
                {
                    leaguePerformance.AddItem(new LeaguePerformanceItem(item));
                }

                leaguePerformance.Total.Margin = CalculateTotalMargin(leaguePerformance.Total.WinLoss, leaguePerformance.Total.Turnover);
                SessionManager.Set<LeaguePerformanceList>(LeaguePerformanceDetailReportSessionKey, leaguePerformance);
            }

            return leaguePerformance;
        }

        /// <summary>
        /// Gets the trader performance of a league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformanceOfLeague(GetTraderPerformanceOfLeagueCriteria criteria)
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
        /// Gets the match performance of a pair of league and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        public MatchPerformanceGroup GetMatchPerformanceOfLeagueTrader(GetMatchPerformanceOfLeagueTraderCriteria criteria)
        {
            IEnumerable<MatchPerformanceInfo> matchData = this.GetData<MatchPerformanceInfo>(criteria);
            MatchPerformanceGroup matchPerformance = new MatchPerformanceGroup();

            if (matchData != null && matchData.Any())
            {
                foreach (MatchPerformanceInfo item in matchData)
                {
                    matchPerformance.AddItem(new MatchPerformanceItem(item));
                }

                matchPerformance.Total.Margin = CalculateTotalMargin(matchPerformance.Total.WinLoss, matchPerformance.Total.Turnover);
            }

            return matchPerformance;
        }

        /// <summary>
        /// Gets the bet type detail from league report.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of bet type detail objects.</returns>
        public IEnumerable<BetTypeDetailItem> GetBettypeDetailLeague(GetBettypeDetailLeague criteria)
        {
            GetScoreByPeriodCriteria scoreByPeriodCriteria = new GetScoreByPeriodCriteria
            {
                FromDate = criteria.FromDate,
                ToDate = criteria.ToDate,
                CustId = criteria.CustId,
                MatchId = criteria.MatchId,
            };
            IEnumerable<BetTypeDetailInfo> bettypeData = this.GetData<BetTypeDetailInfo>(criteria);
            List<BetTypeDetailItem> bettypeDetail = new List<BetTypeDetailItem>();

            if (bettypeData != null && bettypeData.Any())
            {
                foreach (var item in bettypeData)
                {
                    var bettypeItem = new BetTypeDetailItem(item);
                    bettypeItem.ScoreByPeriod = new List<ScoreByPeriodItem>();
                    scoreByPeriodCriteria.Bettypes = item.BetType.ToString();
                    IEnumerable<ScoreByPeriodInfo> scoreByPeriodData = this.GetData<ScoreByPeriodInfo>(scoreByPeriodCriteria);
                    foreach (var scoreByPeriodInfo in scoreByPeriodData)
                    {
                        bettypeItem.ScoreByPeriod.Add(new ScoreByPeriodItem(scoreByPeriodInfo));
                    }

                    bettypeDetail.Add(bettypeItem);
                }
            }

            return bettypeDetail;
        }

        /// <summary>
        /// Export League Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templatePath">Path to Excel template file.</param>
        public void ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria, string templatePath)
        {
            LeaguePerformanceList leagueData = SessionManager.Get<LeaguePerformanceList>(LeaguePerformanceDetailReportSessionKey);

            if ((leagueData != null) && (leagueData.ItemList.Count > 0))
            {
                string reportName = string.Format(
                                ViewLang.PerformanceDetailFileName,
                                ViewLang.League,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.LeaguePerformance);
                writer.CopyRows(0, 1);

                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 3);
                FillRowData(leagueData, ref writer);

                writer.SyncColumnsWidth(9);
                writer.Render();
            }
        }

        /// <summary>
        /// Calculates the total margin.
        /// </summary>
        /// <param name="winLoss">The win loss.</param>
        /// <param name="turnover">The turnover.</param>
        /// <returns>The margin value.</returns>
        private decimal? CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            decimal? margin = null;

            if (turnover != 0)
            {
                margin = winLoss / turnover * 100;
            }

            return margin;
        }

        /// <summary>
        /// Fills the header.
        /// </summary>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 1);
        }

        /// <summary>
        /// Generate bet type string.
        /// </summary>
        /// <param name="data">List of all bet types.</param>
        /// <param name="betTypes">String contains criteria's bet types id.</param>
        /// <returns>Bet type string.</returns>
        private string MakeBetTypeSelectString(List<BetTypeItem> data, string betTypes)
        {
            if (betTypes == "0")
            {
                return string.Join(", ", data.Select(obj => obj.BetTypeName));
            }
            else
            {
                return string.Join(", ", data.Where(obj => betTypes.Contains(obj.BetTypeId.ToString())).Select(obj => obj.BetTypeName));
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(LeaguePerformanceList contentData, ref ExcelTemplateWriter writer)
        {
            // Content rows
            int len = contentData.ItemList.Count;
            LeaguePerformanceItem item;

            for (int i = 0; i < len; i++)
            {
                int styleIndex = (i % 2 == 0) ? 4 : 5;
                item = contentData.ItemList[i];

                var record = new object[]
                {
                    i + 1,
                    item.LeagueName,
                    item.NoOfTraders,
                    item.NoOfMatches,
                    item.Turnover,
                    item.WinLoss,
                    item.BetCount,
                    (object)item.Margin ?? ViewLang.NA,
                    item.LeagueBM
                };
                writer.WriteRow(styleIndex, record);
            }

            // Total row
            LeaguePerformanceItem total = contentData.Total;
            var totalRecord = new object[]
            {
                ViewLang.GrandTotal,
                null,
                total.NoOfTraders,
                total.NoOfMatches,
                total.Turnover,
                total.WinLoss,
                total.BetCount,
                (object)total.Margin ?? ViewLang.NA
            };
            writer.WriteRow(6, totalRecord);
        }

        /// <summary>
        /// Append formatted block to the given rich text render.
        /// </summary>
        /// <param name="content">The rich text render object to append.</param>
        /// <param name="lineCount">Content's line count.</param>
        /// <param name="name">Name part of append block.</param>
        /// <param name="nameFont">Font of name part.</param>
        /// <param name="value">Value part of append block.</param>
        /// <param name="valueFont">Font of value part.</param>
        /// <param name="endString">End string.</param>
        private void AppendBlockContent(ref RichTextRender content, ref int lineCount, string name, IFont nameFont, string value, IFont valueFont, string endString)
        {
            if (string.IsNullOrEmpty(value))
            {
                return;
            }

            // Name
            TextBlock nameBlock = new TextBlock(name + ":  ", nameFont);
            content = content.AddText(nameBlock);

            // Value
            TextBlock valueBlock = new TextBlock(value, valueFont);
            content = content.AddText(valueBlock);

            if (!string.IsNullOrEmpty(endString))
            {
                content = content.AddText(endString);
            }

            lineCount += CountLine(name + value);
        }

        private int CountLine(string line)
        {
            int charPerLine = 216; // Number char per line in filter block - use to calculate number of line
            return Convert.ToInt32(Math.Ceiling((float)line.Length / charPerLine));
        }

        /// <summary>
        /// Make Filter row.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        [SuppressMessage("StyleCop.CSharp.Nexcel.NexcelCustomRules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(GetLeaguePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(10, 0);
            IFont normalFont = writer.GetFont(11, 0);
            int lineCount = 0;

            List<BetTypeItem> betTypes = this.GetBetTypes().ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.BetTypes);
            string turnoverString = (criteria.Turnover != null) ? criteria.Turnover.Format(2) : string.Empty;
            string winlostString = (criteria.WinLost != null) ? criteria.WinLost.Format(2) : string.Empty;

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

            //// League
            string leagueString = (criteria.LeagueName != null) ? string.Format("contains '{0}'", criteria.LeagueName) : string.Empty;
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.League, boldFont, leagueString, normalFont, "\n");

            //// LeagueBM
            var leagueBMFromString = MinPercentString;
            var leagueBMToString = MaxPercentString;
            if (criteria.LeagueBMFrom != null)
            {
                leagueBMFromString = criteria.LeagueBMFrom.ToString();
            }

            if (criteria.LeagueBMTo != null)
            {
                leagueBMToString = criteria.LeagueBMTo.ToString();
            }

            if (criteria.LeagueBMFrom != null || criteria.LeagueBMTo != null)
            {
                string marginString;
                if (criteria.LeagueBMFrom == null)
                {
                    marginString = string.Format("≤ {0}", criteria.LeagueBMTo);
                }
                else if (criteria.LeagueBMTo == null)
                {
                    marginString = string.Format("≥ {0}", criteria.LeagueBMFrom);
                }
                else
                {
                    marginString = string.Format("from {0} to {1}", leagueBMFromString, leagueBMToString);
                }

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueBM, boldFont, marginString, normalFont, "\n");
            }

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(7, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }
    }
}