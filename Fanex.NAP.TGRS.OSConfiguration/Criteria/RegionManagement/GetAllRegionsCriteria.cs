namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.RegionManagement
{
    using Fanex.Data.Repository;

    public class GetAllRegionsCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_RegionGetAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}