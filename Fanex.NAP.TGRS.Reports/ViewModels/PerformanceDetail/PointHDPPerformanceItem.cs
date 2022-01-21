namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;

    [Serializable]
    public class PointHDPPerformanceItem
    {
        public PointHDPPerformanceItem() { }

        public PointHDPPerformanceItem(PointHDPPerformanceInfo info)
        {
            this.PointHDP = info.PointHDP;
            this.NoOfLeagues = info.LeagueCount;
            this.NoOfMatches = info.MatchCount;
            this.BetCount = info.BetCount;
            this.Turnover = info.Turnover;
            this.WinLoss = info.WinLoss;
            this.Margin = info.Margin;
            this.TurnoverReal = info.TurnoverReal;
            this.WinLossReal = info.WinLossReal;
            this.MarginReal = info.MarginReal;            
        }

        public decimal PointHDP { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }       
    }
}
