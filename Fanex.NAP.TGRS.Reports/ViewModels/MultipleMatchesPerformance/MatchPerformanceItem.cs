namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.Common;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
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
                this.EventDate = matchData.EventDate;
                this.LeagueName = matchData.LeagueName;
                this.Turnover = Converter.ToDecimal(matchData.Turnover);
                this.WinLoss = Converter.ToDecimal(matchData.WinLoss);
                this.BetCount = Converter.ToInt(matchData.BetCount);
                this.Margin = Converter.ToDecimal(matchData.Margin);
            }
        }

        public int MatchId { get; set; }

        public string MatchName { get; set; }

        public string LeagueName { get; set; }

        public DateTime? EventDate { get; set; }

        public string KOTime
        {
            get
            {
                return this.EventDate.HasValue ?
                        this.EventDate.Value.ToShortDateString() + " " + this.EventDate.Value.ToShortTimeString()
                        : string.Empty;
            }
        }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }
    }
}