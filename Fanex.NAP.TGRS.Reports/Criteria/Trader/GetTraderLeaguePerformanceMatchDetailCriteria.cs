namespace Fanex.NAP.TGRS.Reports.Criteria.Trader
{
    using Fanex.Data.Repository;
    using System;

    public class GetTraderLeaguePerformanceMatchDetailCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int MatchId { get; set; }

        public DateTime EventDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_TraderLeaguePerformance_MatchDetail";
        }

        public override bool IsValid()
        {
            return TraderId > 0 && MatchId > 0;
        }
    }
}
