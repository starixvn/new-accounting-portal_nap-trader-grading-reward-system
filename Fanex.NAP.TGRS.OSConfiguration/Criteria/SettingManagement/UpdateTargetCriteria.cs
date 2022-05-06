namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    using Fanex.Data.Repository;

    public class UpdateTargetCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public int SpecialTargetId { get; set; }

        public double NewTarget { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_SpecialTargetUpdate";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
