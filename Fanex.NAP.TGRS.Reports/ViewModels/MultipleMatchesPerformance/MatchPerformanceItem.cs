namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.Common;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using System;

    /// <summary>
    /// Match performance view model.
    /// </summary>
    [Serializable]
    public class MatchPerformanceItem
    {
        public MatchPerformanceItem()
        {
        }

        public MatchPerformanceItem(MatchPerformanceInfo matchData)
        {
            if (matchData != null && matchData.MatchId.HasValue)
            {
                this.MatchId = matchData.MatchId.Value;
                this.MatchName = string.Format("{0} {1} {2}", CacheRef.GetTeamName(matchData.HomeId), ViewLang.Vs, CacheRef.GetTeamName(matchData.AwayId));
                this.EventDate = Convert.ToDateTime(matchData.EventDate).ToShortFormatedDate();
                this.Turnover = Converter.ToDecimal(matchData.Turnover);
                this.WinLoss = Converter.ToDecimal(matchData.WinLoss);
                this.BetCount = Converter.ToInt(matchData.BetCount);
                this.Margin = matchData.Margin;
            }
        }

        public int MatchId { get; set; }

        public string MatchName { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public string EventDate { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }
    }
}