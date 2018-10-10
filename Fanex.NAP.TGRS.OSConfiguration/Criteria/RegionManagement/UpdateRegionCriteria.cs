namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.RegionManagement
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;

    public class UpdateRegionCriteria : CriteriaBase
    {
        public int RegionId { get; set; }

        public string RegionName { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_RegionUpdate";
        }

        public override bool IsValid()
        {
            return RegionId > 0 && !string.IsNullOrEmpty(RegionName);
        }
    }
}