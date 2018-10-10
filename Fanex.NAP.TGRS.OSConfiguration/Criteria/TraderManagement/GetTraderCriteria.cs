namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement
{
    using Fanex.Data.Repository;

    public class GetTraderCriteria : CriteriaBase
    {
        public string TraderName { get; set; }

        public int TeamId { get; set; }

        public int GradeId { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderGet";
        }
    }
}