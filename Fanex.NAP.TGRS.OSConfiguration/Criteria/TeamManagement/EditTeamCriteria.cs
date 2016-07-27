using Fanex.Data.Repository;

namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement
{
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