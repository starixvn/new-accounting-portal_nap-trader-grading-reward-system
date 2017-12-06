using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly
{
    public class MonthlyFilter : CriteriaBase
    {
        public int Bettype { get; set; }

        public string TraderName { get; set; }

        public int LiveStatus { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_TraderPerformanceMonthly";
        }
    }
}