namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;

    [Serializable]
    public class QuarterOfBettypeBetChoiceItem
    {
        public QuarterOfBettypeBetChoiceItem()
        {
        }

        public QuarterOfBettypeBetChoiceItem(int betTypeId, QuarterOfBettypeBetChoiceInfo info)
        {
            this.Quarter = CacheRef.GetQuarter(betTypeId, info.BetId);
            this.BetId = info.BetId;
            this.IsLive = info.IsLive;
            this.NoOfLeagues = Converter.ToInt(info.LeagueCount);
            this.NoOfMatches = Converter.ToInt(info.MatchCount);
            this.Turnover = Converter.ToDecimal(info.Turnover);
            this.WinLoss = Converter.ToDecimal(info.WinLoss);
            if (this.Turnover != 0)
            {
                this.Margin = Converter.ToDecimal(info.WinLoss / info.Turnover * 100);
            }
            this.BetCount = Converter.ToInt(info.BetCount);
        }

        public string Quarter { get; set; }

        public long BetId { get; set; }

        public bool IsLive { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public int BetCount { get; set; }
    }

    public class HdpOfBettypeBetChoiceItem
    {
        public HdpOfBettypeBetChoiceItem()
        {
        }

        public HdpOfBettypeBetChoiceItem(int betTypeId, HdpOfBettypeBetChoiceInfo info)
        {
            this.Quarter = info.Hdp;
            this.BetId = info.BetId;
            this.IsLive = info.IsLive;
            this.NoOfLeagues = Converter.ToInt(info.LeagueCount);
            this.NoOfMatches = Converter.ToInt(info.MatchCount);
            this.Turnover = Converter.ToDecimal(info.Turnover);
            this.WinLoss = Converter.ToDecimal(info.WinLoss);
            if (this.Turnover != 0)
            {
                this.Margin = Converter.ToDecimal(info.WinLoss / info.Turnover * 100);
            }
            this.BetCount = Converter.ToInt(info.BetCount);
        }

        public decimal Quarter { get; set; }

        public long BetId { get; set; }

        public bool IsLive { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public int BetCount { get; set; }
    }
}
