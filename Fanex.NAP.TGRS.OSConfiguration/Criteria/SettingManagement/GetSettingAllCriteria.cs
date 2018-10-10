namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    using Fanex.Data.Repository;

    public class GetSettingAllCriteria : CriteriaBase
    {
        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_SpecialTargetGetAll";
        }
    }
}