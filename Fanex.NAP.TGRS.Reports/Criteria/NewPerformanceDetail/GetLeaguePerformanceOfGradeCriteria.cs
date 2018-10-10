namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetLeaguePerformanceOfGradeCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public byte Grade { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_NewPerformanceDetail_Grade_League";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}