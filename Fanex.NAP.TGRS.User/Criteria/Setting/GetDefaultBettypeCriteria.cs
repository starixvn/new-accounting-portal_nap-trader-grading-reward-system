namespace Fanex.NAP.TGRS.User.Criteria.Setting
{
    using Fanex.NAP.Framework.Data;

    public class GetDefaultBettypeCriteria : CriteriaBase
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