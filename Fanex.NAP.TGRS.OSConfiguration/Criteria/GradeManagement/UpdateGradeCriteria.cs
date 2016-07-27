namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.GradeManagement
{
    using Fanex.Data.Repository;

    public class UpdateGradeCriteria : CriteriaBase
    {
        public int GradeId { get; set; }

        public string NewName { get; set; }

        public override string GetSettingKey()
        {
            return base.GetSettingKey();
        }
    }
}