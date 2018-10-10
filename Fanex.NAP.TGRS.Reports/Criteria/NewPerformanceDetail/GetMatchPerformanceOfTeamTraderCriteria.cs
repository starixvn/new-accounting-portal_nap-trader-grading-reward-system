namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetMatchPerformanceOfTeamTraderCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public short TeamId { get; set; }

        public int CustId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Team_Trader_Match";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}