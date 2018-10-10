namespace Fanex.NAP.TGRS.OSReports.Criteria.NewSportPerformance
{
    using Fanex.Data.Repository;

    public class GetAllSportsCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_OS_SportGetAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}