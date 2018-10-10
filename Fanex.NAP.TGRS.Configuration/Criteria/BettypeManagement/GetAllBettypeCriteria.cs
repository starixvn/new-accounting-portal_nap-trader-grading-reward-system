namespace Fanex.NAP.TGRS.Configuration.Criteria.BettypeManagement
{
    using Data.Repository;

    public class GetAllBettypeCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_BettypeManagement_Bettype_SelectAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}