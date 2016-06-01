namespace Fanex.NAP.TGRS.Reports.ViewModels.Trader
{
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.Trader;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using System.Collections.Generic;

    public class TraderReports
    {
        public GeneralInfo GeneralInfo { get; set; }

        public IEnumerable<TraderWinlossTurnover> WinlossTurnover { get; set; }

        public IEnumerable<BetTypePerformance> BetTypePerformances { get; set; }

        public LeaguePerformanceList LeaguesPerformance { get; set; }
    }
}
