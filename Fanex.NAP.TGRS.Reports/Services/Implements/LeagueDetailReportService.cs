// --------------------------------------------------------------------------
// <copyright file="LeagueDetailReportService.cs" company="Nexcel Solutions Vietnam">
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
        private const string LeaguePerformanceDetailReportSeesionKey = "Fanex.NAP.TGRS.Reports.LeaguePerformance";

        /// <summary>
        /// Gets the bet types.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        public IEnumerable<BetTypeItem> GetBetTypes()
        {
            var criteria = new GetBetTypesCriteria();
            IEnumerable<BetTypeInfo> data = this.GetData<BetTypeInfo>(criteria);
            IEnumerable<BetTypeItem> betTypes = null;

            if (data != null && data.Any())
            {
                betTypes = data.Select(obj => new BetTypeItem(obj));
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
                SessionManager.Set<LeaguePerformanceList>(LeaguePerformanceDetailReportSeesionKey, leaguePerformance);
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
        /// Export LeaguePerformance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templateUrl">Path to Excel template file.</param>
        public void ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria, string templateUrl)
        {
            LeaguePerformanceList leagueData = SessionManager.Get<LeaguePerformanceList>(LeaguePerformanceDetailReportSeesionKey);

            if ((leagueData != null) && (leagueData.ItemList.Count > 0))
            {
                var writer = new ExcelTemplateWriter(templateUrl, ViewLang.LeaguePerformance, ViewLang.LeaguePerformance);
                writer.CopyRows(0, 4);

                // Write content.
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
                    item.Margin,
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
                CalculateMarginVal(total.WinLoss, total.Turnover)
            };
            writer.WriteRow(6, totalRecord);
        }

        /// <summary>
        /// Calculates Margin.
        /// </summary>
        /// <param name="winloss">WINLOSS value.</param>
        /// <param name="turnover">Turnover value.</param>
        /// <returns>Margin value.</returns>
        private object CalculateMarginVal(decimal winloss, decimal turnover)
        {
            if (turnover != 0)
            {
                return (winloss / turnover) * 100;
            }
            else
            {
                return ViewLang.NA;
            }
        }
    }
}