namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetMatchBettypeCriteria : CriteriaBase
    {
        public int LeagueId { get; set; }

        public string MatchIds { get; set; }

        public int TraderId { get; set; }

        public int SportId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey() => "TGRS_OS_Rpt_TraderPerformance_Sport_League_Match_Bettype";

        public override bool IsValid() => true;
    }
}