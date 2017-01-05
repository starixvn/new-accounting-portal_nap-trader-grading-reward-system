namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetTraderPerformanceOfLeagueCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LeagueId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_League_Trader";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}