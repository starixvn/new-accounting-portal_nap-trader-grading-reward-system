namespace Fanex.NAP.TGRS.Reports.Criteria.Trader
{
    using Fanex.Data.Repository;
    using System;

    public class GetTraderLeaguePerformanceDetailCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int LeagueId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_TraderLeaguePerformance_Detail";
        }

        public override bool IsValid()
        {
            return TraderId > 0 && LeagueId > 0;
        }
    }
}
