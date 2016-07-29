namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement
{
    using Fanex.NAP.Framework.Data;

    public class UpdateTeamCriteria : CriteriaBase
    {
        public int TeamId { get; set; }

        public string NewName { get; set; }

        public override string GetSettingKey()
        {
            return base.GetSettingKey();
        }
    }
}