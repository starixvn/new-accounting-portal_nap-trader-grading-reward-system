namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;

    public class TraderPerformanceItem
    {
        public TraderPerformanceItem() { }

        public TraderPerformanceItem(TraderPerformanceInfo traderData)
        {
            if (traderData != null)
            {
                this.TraderId = traderData.CustId;
                this.TraderName = traderData.CustId + " Name";
                this.Grade = 3;
                this.TeamId = 0;
                this.TeamName = "Team Name";
                this.NoOfTimes = Converter.ToInt(traderData.MultipleTimes);
                this.NoOfMatches = Converter.ToInt(traderData.MatchCount);
                this.Turnover = 4000;
                this.WinLoss = 375;
                this.BetCount = 6200;
                this.Margin = Converter.ToDecimal(2.5);
                this.FrequencyCust = traderData.FrequencyCust;
            }
        }

        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public int Grade { get; set; }

        public int TeamId { get; set; }

        public string TeamName { get; set; }

        public int NoOfTimes { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal? Margin { get; set; }

        public int FrequencyCust { get; set; }
    }
}