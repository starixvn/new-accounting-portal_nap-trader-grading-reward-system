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

        public static RTModelPerformanceInfo operator +(RTModelPerformanceInfo info1, RTModelPerformanceInfo info2)
        {
            if (info1 == null)
            {
                return info2;
            }

            if (info2 == null)
            {
                return info1;
            }

            var sumInfo = new RTModelPerformanceInfo
            {
                BetCount = info1.BetCount + info2.BetCount,
                MatchCount = info1.MatchCount + info2.MatchCount,
                Stake_VR = info1.Stake_VR + info2.Stake_VR,
                WinLoss_VR = info1.WinLoss_VR + info2.WinLoss_VR,
                Stake_VAR = info1.Stake_VAR + info2.Stake_VAR,
                Winloss_VAR = info1.Winloss_VAR + info2.Winloss_VAR,
                Stake_AR = info1.Stake_AR + info2.Stake_AR,
                Winloss_AR = info1.Winloss_AR + info2.Winloss_AR,
                Stake_8RM = info1.Stake_8RM + info2.Stake_8RM,
                Winloss_8RM = info1.Winloss_8RM + info2.Winloss_8RM,
                Stake_AR8RM = info1.Stake_AR8RM + info2.Stake_AR8RM,
                Winloss_AR8RM = info1.Winloss_AR8RM + info2.Winloss_AR8RM,
                TypeSiteId = info1.TypeSiteId,
                TypeSiteDesc = info1.TypeSiteDesc
            };

            sumInfo.Margin_VR = sumInfo.Stake_VR == 0 ? 0 : (sumInfo.WinLoss_VR / sumInfo.Stake_VR) * 100;
            sumInfo.Margin_VAR = sumInfo.Stake_VAR == 0 ? 0 : (sumInfo.Winloss_VAR / sumInfo.Stake_VAR) * 100;
            sumInfo.Margin_AR = sumInfo.Stake_AR == 0 ? 0 : (sumInfo.Winloss_AR / sumInfo.Stake_AR) * 100;
            sumInfo.Margin_8RM = sumInfo.Stake_8RM == 0 ? 0 : (sumInfo.Winloss_8RM / sumInfo.Stake_8RM) * 100;
            sumInfo.Margin_AR8RM = sumInfo.Stake_AR8RM == 0 ? 0 : (sumInfo.Winloss_AR8RM / sumInfo.Stake_AR8RM) * 100;

            return sumInfo;
        }
    }
}
