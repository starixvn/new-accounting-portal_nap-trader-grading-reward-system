namespace Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement
{
    using Fanex.NAP.Framework.Data;

    public class GetAllShiftCriteria : CriteriaBase
    {
        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_Trader_Shift_SelectAll";
        }
    }
}