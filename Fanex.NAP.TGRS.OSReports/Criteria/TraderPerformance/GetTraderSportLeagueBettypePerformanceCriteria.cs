namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetTraderSportLeagueBettypePerformanceCriteria : CriteriaBase
    {        
        public int TraderId { get; set; }

        public int SportId { get; set; }

        public int LeagueId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_TraderPerformance_Sport_League_Bettype";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}