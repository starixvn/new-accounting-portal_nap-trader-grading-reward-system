namespace Fanex.NAP.TGRS.Reports.ViewModels.Dashboard
{
    using System;

    [Serializable]
    public class BasketballSummaryGeneralInfoItem
    {
        public DateTime EventDate { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Turnover { get; set; }

        public decimal Margin { get; set; }

        public int MatchCount { get; set; }

        public int BetCount { get; set; }
    }
}
