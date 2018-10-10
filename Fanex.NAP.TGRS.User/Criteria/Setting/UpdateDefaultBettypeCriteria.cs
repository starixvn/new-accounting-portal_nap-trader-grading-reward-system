namespace Fanex.NAP.TGRS.User.Criteria.Setting
{
    using Fanex.Data.Repository;

    public class UpdateDefaultBettypeCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public string IsDefaultBettypes { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_UserSetting_UpdateDefaultBettypes";
        }
    }
}