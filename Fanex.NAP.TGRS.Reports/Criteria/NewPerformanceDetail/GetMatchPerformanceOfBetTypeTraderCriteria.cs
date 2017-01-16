namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetMatchPerformanceOfBetTypeTraderCriteria : CriteriaBase
    {
        public short BetType { get; set; }

        public int CustId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [SpParam(Ignored = true)]
        public bool IsViewScore { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Bettype_Trader_Match";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}