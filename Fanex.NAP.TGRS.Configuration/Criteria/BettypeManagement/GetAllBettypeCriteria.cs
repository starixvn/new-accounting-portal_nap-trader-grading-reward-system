namespace Fanex.NAP.TGRS.Configuration.Criteria.BettypeManagement
{
    using NAP.Framework.Data;

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