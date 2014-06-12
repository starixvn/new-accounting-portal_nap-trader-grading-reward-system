// --------------------------------------------------------------------------
// <copyright file="TraderDetailReportService.cs" company="Nexcel Solutions Vietnam">
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
        private const string TraderPerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.TraderPerformance";

        /// <summary>
        /// Gets the trader performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformance(GetTraderPerformanceCriteria criteria)
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
                SessionManager.Set<TraderPerformanceList>(TraderPerformanceDetailReportSessionKey, traderPerformance);
            }

            return traderPerformance;
        }

        /// <summary>
        /// Gets the match performance of a trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceList object.</returns>
        public MatchPerformanceList GetMatchPerformanceOfTrader(GetMatchPerformanceOfTraderCriteria criteria)
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

                matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
                matchPerformance.TotalItems = matchData.Count();
            }

            return matchPerformance;
        }
    }
}