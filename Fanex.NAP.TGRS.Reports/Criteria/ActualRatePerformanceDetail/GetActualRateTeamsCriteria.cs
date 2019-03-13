namespace Fanex.NAP.TGRS.Reports.Criteria.ActualRatePerformanceDetail
{
    using Fanex.Data.Repository;

    public class GetActualRateTeamsCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_Team_SelList";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
