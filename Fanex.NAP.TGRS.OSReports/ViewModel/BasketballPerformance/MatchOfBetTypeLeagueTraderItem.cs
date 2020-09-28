namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    using Fanex.Common;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using System;

    [Serializable]
    public class MatchOfBettypeLeagueTraderItem
    {
        public MatchOfBettypeLeagueTraderItem() { }

        public MatchOfBettypeLeagueTraderItem(MatchOfBettypeLeagueTraderInfo data)
        {
            this.MatchId = data.MatchId;        
            this.MatchName = string.Format("{0} {1} {2}", CacheRef.GetTeamName(data.HomeId), ViewLang.Vs, CacheRef.GetTeamName(data.AwayId));
            this.EventDate = Convert.ToDateTime(data.EventDate).ToShortFormatedDate();
            this.IsLive = data.IsLive;
            this.Turnover = Converter.ToDecimal(data.Turnover);
            this.WinLoss = Converter.ToDecimal(data.WinLoss);
            this.BetCount = Converter.ToInt(data.BetCount);
            this.Margin = data.Margin;
        }

        public int MatchId { get; set; }

        public string MatchName { get; set; }
        
        public string EventDate { get; set; }

        public bool IsLive { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

    }
}
