namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetLeaguePerformanceOfBetTypeCriteria : CriteriaBase
    {
        public short BetType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Bettype_League";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}