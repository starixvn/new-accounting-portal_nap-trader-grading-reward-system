namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.NAP.Framework.Data;
    using System;

    public class GetTraderPerformanceOfGradeCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public byte Grade { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Grade_Trader";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}