namespace Fanex.NAP.TGRS.Configuration.Criteria.TargetedMargin
{
    using Framework.Data;

    public class SelectAllTargetedMarginCriteria : CriteriaBase
    {
        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_TargetedMargin_SelectAll";
        }
    }
}