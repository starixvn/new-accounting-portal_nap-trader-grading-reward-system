using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly
{
    public class GetTraderPerformanceMonthlyCriteria : CriteriaBase
    {
        public int Year { get; set; }

        public int Shift { get; set; }

        public int Grade { get; set; }

        public int Bettype { get; set; }

        public string TraderName { get; set; }

        public string LeagueName { get; set; }

        public int LiveStatus
        {
            get
            {
                return 1;
            }
        }

        public bool IsExcludeLeagues { get; set; }

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