namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.GradeManagement
{
    using Fanex.NAP.Framework.Data;

    public class InsertGradeCriteria : CriteriaBase
    {
        public string Name { get; set; }

        public override string GetSettingKey()
        {
            return base.GetSettingKey();
        }
    }
}