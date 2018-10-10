namespace Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement
{
    using Fanex.Data.Repository;

    public class GetShiftHistoryCriteria : CriteriaBase
    {
        public int CustId { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_Trader_ShiftHistory";
        }
    }
}