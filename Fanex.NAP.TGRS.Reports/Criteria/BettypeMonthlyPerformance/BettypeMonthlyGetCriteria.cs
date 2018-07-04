namespace Fanex.NAP.TGRS.Reports.Criteria.BettypeMonthlyPerformance
{
    using Fanex.NAP.Framework.Data;

    public class BettypeMonthlyGetCriteria : CriteriaBase
    {
        public int Year { get; set; }

        public string Bettypes { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_BettypePerformanceMonthly";
        }

        public override bool IsValid() => true;
    }
}