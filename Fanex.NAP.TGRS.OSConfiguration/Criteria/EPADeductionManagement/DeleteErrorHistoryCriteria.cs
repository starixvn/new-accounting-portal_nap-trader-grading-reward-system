namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement
{
    using Fanex.NAP.Framework.Data;

    public class DeleteErrorHistoryCriteria : CriteriaBase
    {
        public int CreatorId { get; set; }

        public int TraderErrorId { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderErrorDelete";
        }
    }
}
