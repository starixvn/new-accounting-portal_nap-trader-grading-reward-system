namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using System;

    [Serializable]
    public class TraderPerformanceItem
    {
        public TraderPerformanceItem() { }

        public TraderPerformanceItem(TraderPerformanceInfo traderData)
        {
            if (traderData != null)
            {
                this.MultipleMatches = Converter.ToInt(traderData.MultipleMatches);
                this.Count = Converter.ToInt(traderData.MultipleTimes);
                this.MatchList = traderData.MatchList;
                this.Turnover = Converter.ToDecimal(traderData.Turnover);
                this.WinLoss = Converter.ToDecimal(traderData.Winloss);
                this.BetCount = Converter.ToInt(traderData.BetCount);
                this.Margin = Converter.ToDecimal(traderData.Margin);
            }
        }

        public int MultipleMatches { get; set; }

        public int Count { get; set; }

        public string MatchList { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }        
    }
}