namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;

    [Serializable]
    public class BettypePerformanceItem
    {
        public BettypePerformanceItem() { }

        public BettypePerformanceItem(BettypePerformanceInfo data)
        {
            if (data != null && data.BetType.HasValue)
            {
                this.BetTypeId = data.BetType.Value;
                this.BetTypeName = data.BettypeName;
                this.IsLive = data.IsLive;
                this.NoOfTraders = Converter.ToInt(data.TraderCount);
                this.NoOfLeagues = Converter.ToInt(data.LeagueCount);
                this.NoOfMatches = Converter.ToInt(data.MatchCount);
                this.Turnover = Converter.ToDecimal(data.Turnover);
                this.WinLoss = Converter.ToDecimal(data.WinLoss);
                this.BetCount = Converter.ToInt(data.BetCount);
                this.Margin = Converter.ToDecimal(data.Margin);
            }
        }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public bool IsLive { get; set; }

        public int NoOfTraders { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }        

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }
    }
}
