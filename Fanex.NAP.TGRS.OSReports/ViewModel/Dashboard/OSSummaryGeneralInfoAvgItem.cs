namespace Fanex.NAP.TGRS.OSReports.ViewModel.Dashboard
{
    using System;

    [Serializable]
    public class OSSummaryGeneralInfoAvgItem
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public decimal AvgWinLoss { get; set; }

        public decimal AvgTurnover { get; set; }

        public decimal AvgMargin { get; set; }

        public int AvgMatchCount { get; set; }

        public int AvgBetCount { get; set; }
    }
}