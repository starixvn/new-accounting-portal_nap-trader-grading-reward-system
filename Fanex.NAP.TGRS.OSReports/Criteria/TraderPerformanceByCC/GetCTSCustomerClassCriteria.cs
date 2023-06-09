namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformanceByCC
{
    using Fanex.Data.Repository;

    public class GetCTSCustomerClassCriteria : CriteriaBase
    {
        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "CTS_DC_TGRS_Category_Get";
        }
    }
}