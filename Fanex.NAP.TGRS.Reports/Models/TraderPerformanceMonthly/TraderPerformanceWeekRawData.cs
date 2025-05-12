using System;

namespace Fanex.NAP.TGRS.Reports.Models.TraderPerformanceMonthly
{    
    public class TraderPerformanceWeekRawData
    {        
        public string TraderName { get; set; }
        public DateTime EventDate { get; set; }
        public string LeagueName { get; set; }
        public string Grade { get; set; }
        public string TeamName { get; set; }
        public string Department { get; set; }
        public decimal Turnover { get; set; }
        public decimal NetWinLoss { get; set; }
        public decimal Margin { get; set; }
        public int BetCount { get; set; }
        public int MatchCount { get; set; }
    }
}
