namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement
{
    using Fanex.NAP.Framework.Data;

    public class InsertTeamCriteria : CriteriaBase
    {
        public string Name { get; set; }

        public override string GetSettingKey()
        {
            return base.GetSettingKey();
        }
    }
}