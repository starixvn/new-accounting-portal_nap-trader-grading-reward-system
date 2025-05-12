using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly
{
    public class GetTraderPerformanceMonthlyWeekCriteria : CriteriaBase
    {
        public int Year { get; set; }
        
        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_TraderPerformanceWeeklyExcel";
        }
    }
}