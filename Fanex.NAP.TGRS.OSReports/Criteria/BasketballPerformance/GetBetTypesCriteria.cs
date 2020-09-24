namespace Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance
{
    using Fanex.Data.Repository;    

    public class GetBettypesCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_Basketball_BettypeSetting_GetBettypes";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
