namespace Fanex.NAP.TGRS.Reports.Criteria.TraderPerformanceMonthly
{
    using Fanex.Data.Repository;

    public class GetAllShiftCriteria : CriteriaBase
    {
        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_Trader_Shift_SelectAll";
        }
    }
}
