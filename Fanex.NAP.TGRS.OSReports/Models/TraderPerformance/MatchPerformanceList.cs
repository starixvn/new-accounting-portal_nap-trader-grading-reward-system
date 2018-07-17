namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    using System.Collections.Generic;
    using System.Linq;

    public class MatchPerformanceList
    {
        public IEnumerable<MatchPerformanceGroup> GroupData { get; set; }

        public double Point => GroupData.Sum(d => d.Point);

        public double Turnover => GroupData.Sum(d => d.Turnover);

        public double Winloss => GroupData.Sum(d => d.Winloss);

        public double Margin => Turnover == 0 ? 0 : Winloss * 100 / Turnover;

        public double EventProduct => GroupData.Sum(d => d.EventProduct);
    }
}