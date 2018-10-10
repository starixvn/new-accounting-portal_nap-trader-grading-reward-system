namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.SettingManagement
{
    using Fanex.Data.Repository;
    
    public class AddSettingCriteria : CriteriaBase
    {
        public int UserId { get; set; }

        public int SportId { get; set; }

        public int LeagueId { get; set; }

        public int BettypeId { get; set; }

        public double Target { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_OS_SpecialTargetInsert";
        }
    }
}