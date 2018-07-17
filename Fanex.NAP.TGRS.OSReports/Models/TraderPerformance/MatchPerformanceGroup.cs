using RemotingRef;
using System.Collections.Generic;
using System.Linq;

namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    public class MatchPerformanceGroup
    {
        public MatchPerformanceGroup(int leagueId, IEnumerable<MatchPerformance> data)
        {
            GroupDetails = data;

            League = RefData.GetLeagueName(leagueId.ToString(), "en");
        }

        public IEnumerable<MatchPerformance> GroupDetails { get; }

        public string League { get; }

        public double Point => GroupDetails.Sum(d => d.Point);

        public double Turnover => GroupDetails.Sum(d => d.Turnover);

        public double Winloss => GroupDetails.Sum(d => d.Winloss);

        public double Margin => Turnover == 0 ? 0 : Winloss * 100 / Turnover;

        public double EventProduct => GroupDetails.Sum(d => d.EventProductCount);
    }
}