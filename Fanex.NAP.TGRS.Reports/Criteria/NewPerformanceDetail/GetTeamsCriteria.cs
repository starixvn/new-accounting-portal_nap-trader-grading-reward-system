namespace Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail
{
    using Fanex.NAP.Framework.Data;

    public class GetTeamsCriteria : CriteriaBase
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