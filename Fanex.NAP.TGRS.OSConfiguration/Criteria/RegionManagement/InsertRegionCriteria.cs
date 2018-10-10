namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.RegionManagement
{
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.OSConfiguration.Services.Utility;

    public class InsertRegionCriteria : CriteriaBase
    {
        public string RegionName { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_RegionInsert";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(RegionName);
        }
    }
}