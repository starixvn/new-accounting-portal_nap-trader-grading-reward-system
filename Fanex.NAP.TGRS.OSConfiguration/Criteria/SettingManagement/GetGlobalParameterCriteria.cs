namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    using Fanex.NAP.Framework.Data;

    public class GetGlobalParameterCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_ParameterGetGlobalTarget";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
