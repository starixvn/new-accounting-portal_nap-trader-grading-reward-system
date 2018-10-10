using Fanex.Data.Repository;
using System;

namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance
{
    public class GetTraderMatchPerformanceCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int SportId { get; set; }

        public int LeagueId { get; set; }

        public override string GetSettingKey() => "TGRS_OS_Rpt_TraderPerformance_MatchDetails";

        public override bool IsValid() => true;
    }
}