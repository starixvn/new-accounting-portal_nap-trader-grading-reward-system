namespace Fanex.NAP.TGRS.Reports.ViewModels.Trader
{
    using System;

    public class MatchPerformance
    {
        public int MatchId { get; set; }

        public int HomeId { get; set; }

        public int AwayID { get; set; }

        public DateTime EventDate { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winloss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }
    }
}
