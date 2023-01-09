namespace Fanex.NAP.TGRS.OSReports.ViewModel.SportPerformance
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using System;

    [Serializable]
    public class BettypePerformanceItem
    {
        public BettypePerformanceItem(BettypePerformanceInfo data)
        {
            this.BettypeId = data.BettypeId;
            this.BettypeName = CacheRef.GetQuarter(data.BettypeId, data.BetId);
            this.Turnover = data.Turnover;
            this.VWinLoss = data.VWinLoss;
            this.VMargin = data.VMargin;
            this.AverageVTurnover = data.AverageVTurnover;
            this.PointMargin = data.PointMargin;
            this.BetCount = data.BetCount;
        }

        public int BettypeId { get; set; }

        public int BetId { get; set; }

        public string BettypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal VWinLoss { get; set; }

        public decimal? VMargin { get; set; }

        public decimal? AverageVTurnover { get; set; }

        public decimal? PointMargin { get; set; }

        public int BetCount { get; set; }
    }
}
