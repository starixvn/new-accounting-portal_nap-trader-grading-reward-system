namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement
{
    using Fanex.Data.Repository;

    public class EditTeamCriteria : CriteriaBase
    {
        public int TeamId { get; set; }

        public string NewName { get; set; }

        public override string GetSettingKey()
        {
            return base.GetSettingKey();
        }
    }
}