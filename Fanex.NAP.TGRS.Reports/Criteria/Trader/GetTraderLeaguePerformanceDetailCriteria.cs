namespace Fanex.NAP.TGRS.Reports.Criteria.Trader
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetTraderLeaguePerformanceDetailCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int LeagueId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int PageSize { get; set; }

        public int PageIndex { get; set; }

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
