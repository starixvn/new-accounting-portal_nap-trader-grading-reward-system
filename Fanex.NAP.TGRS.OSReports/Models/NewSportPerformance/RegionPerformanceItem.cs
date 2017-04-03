namespace Fanex.NAP.TGRS.OSReports.Models.NewSportPerformance
{
    public class RegionPerformanceItem
    {
        public string RegionName { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal JuiceTurnover { get; set; }

        public decimal JuiceWinLoss { get; set; }

        public decimal? JuiceMarginTotal
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(JuiceWinLoss / Turnover * 100)) : null;
            }
        }

        public decimal? JuiceMargin
        {
            get
            {
                return JuiceTurnover != 0 ? ((decimal?)(JuiceWinLoss / JuiceTurnover * 100)) : null;
            }
        }

        public decimal? LeftoverMarginTotal
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(LeftoverWinLoss / Turnover * 100)) : null;
            }
        }

        public decimal? LeftoverMargin
        {
            get
            {
                return LeftoverTurnover != 0 ? ((decimal?)(LeftoverWinLoss / LeftoverTurnover * 100)) : null;
            }
        }

        public decimal LeftoverTurnover
        {
            get
            {
                return Turnover - JuiceTurnover;
            }
        }

        public decimal LeftoverWinLoss
        {
            get
            {
                return WinLoss - JuiceWinLoss;
            }
        }

        public decimal? Margin
        {
            get
            {
                return Turnover != 0 ? ((decimal?)(WinLoss / Turnover * 100)) : null;
            }
        }

        public int EventProductCount { get; set; }
    }
}
