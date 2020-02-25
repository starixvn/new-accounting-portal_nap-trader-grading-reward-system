namespace Fanex.NAP.TGRS.Reports.Models.AutomationTradingPerformance
{
    public class RTModelPerformanceInfo
    {
        public int BetCount { get; set; }

        public int MatchCount { get; set; }

        public decimal Stake_VR { get; set; }

        public decimal WinLoss_VR { get; set; }

        public decimal Margin_VR { get; set; }

        public decimal Stake_VAR { get; set; }

        public decimal Winloss_VAR { get; set; }

        public decimal Margin_VAR { get; set; }

        public decimal Stake_AR { get; set; }

        public decimal Winloss_AR { get; set; }

        public decimal Margin_AR { get; set; }

        public decimal Stake_8RM { get; set; }

        public decimal Winloss_8RM { get; set; }

        public decimal Margin_8RM { get; set; }

        public decimal Stake_AR8RM { get; set; }

        public decimal Winloss_AR8RM { get; set; }

        public decimal Margin_AR8RM { get; set; }

        public int TypeSiteId { get; set; }

        public string TypeSiteDesc { get; set; }
    }
}
