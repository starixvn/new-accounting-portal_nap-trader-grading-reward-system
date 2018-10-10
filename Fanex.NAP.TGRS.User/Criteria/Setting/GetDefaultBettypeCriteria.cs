namespace Fanex.NAP.TGRS.User.Criteria.Setting
{
    public class GetDefaultBettypeCriteria : Data.Repository.CriteriaBase
    {
        public int UserId { get; set; }

        public int BettypePermission { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_UserSetting_GetBettypes";
        }
    }
}