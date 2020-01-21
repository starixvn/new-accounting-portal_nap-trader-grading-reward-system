namespace Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail
{
    public class ModelPerformanceInfo
    {
        public RT3PerformanceModel ModelName { get; set; }

        public string Model { get; set; }

        public int Match { get; set; }

        public decimal BetCount { get; set; }

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
    }
}