using Fanex.Common;
using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
using System;

namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    [Serializable]
    public class LeaguePerformanceItem
    {
        public LeaguePerformanceItem() { }

        public LeaguePerformanceItem(LeaguePerformanceInfo data)
        {
            if (data != null && data.LeagueId.HasValue)
            {
                this.LeagueId = data.LeagueId.Value;
                this.LeagueName = data.LeagueName;
                this.IsLive = data.IsLive;
                this.TraderCount = Converter.ToInt(data.TraderCount);
                this.MatchCount = Converter.ToInt(data.MatchCount);
                this.GroupName = data.GroupName;
                this.Turnover = Converter.ToDecimal(data.Turnover);
                this.WinLoss = Converter.ToDecimal(data.WinLoss);
                this.BetCount = Converter.ToInt(data.BetCount);
                this.Margin = Converter.ToDecimal(data.Margin);
            }
        }

        public int? LeagueId { get; set; }

        public string LeagueName { get; set; }

        public string GroupName { get; set; }

        public int TraderCount { get; set; }

        public int MatchCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }

        public bool IsLive { get; set; }
    }
}
