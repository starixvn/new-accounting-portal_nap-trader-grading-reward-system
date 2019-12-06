namespace Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Reports.Models.Permission;

    public class GetBetTypesCriteria : CriteriaBase
    {
        public GetBetTypesCriteria() : this(BettypeViewPermission.All) { }

        public GetBetTypesCriteria(BettypeViewPermission permission)
        {
            BettypePermission = (int)permission;
        }

        public int UserId { get; set; }

        public int BettypePermission { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_UserSetting_GetBettypes";
        }

        /// <summary>
        /// Determines whether this criteria is valid.
        /// </summary>
        /// <returns>Whether this criteria is valid or not.</returns>
        public override bool IsValid()
        {
            return true;
        }
    }
}