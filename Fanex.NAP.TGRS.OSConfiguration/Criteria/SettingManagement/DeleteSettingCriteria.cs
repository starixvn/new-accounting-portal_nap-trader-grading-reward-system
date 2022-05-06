namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    using Fanex.Data.Repository;

    public class DeleteSettingCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public int SpecialTargetId { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_SpecialTargetDelete";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
