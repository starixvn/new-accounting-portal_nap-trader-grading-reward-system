namespace Fanex.MAP.TGRS.WebAPI.Criteria.AutoTrading
{
    using Fanex.Data.Repository;
    using System;   

    public class AutoTradingPerformanceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int Model { get; set; }

        public string TypeSiteIds { get; set; }        

        public override bool IsValid()
            => true;

        public override string GetSettingKey()
            => "";
    }
}