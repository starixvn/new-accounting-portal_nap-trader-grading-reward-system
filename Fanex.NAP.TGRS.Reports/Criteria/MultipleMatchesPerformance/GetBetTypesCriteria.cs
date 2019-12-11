namespace Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.Models.Permission;

    /// <summary>
    /// Getting bet types criteria.
    /// </summary>
    public class GetBetTypesCriteria : CriteriaBase
    {
        public GetBetTypesCriteria() : this(BettypeViewPermission.All) { }

        public GetBetTypesCriteria(BettypeViewPermission permission)
        {
            BettypePermission = (int)permission;
        }

        public int UserId { get; set; }

        public int BettypePermission { get; set; }

        public override string GetSettingKey()
            => "TGRS_UserSetting_GetBettypes";

        public override bool IsValid()
            => true;
    }
}