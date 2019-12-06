namespace Fanex.NAP.TGRS.WebAPI.Criteria
{
    using Fanex.Data.Repository;
    using System;

    public class GetPerformanceDetailsCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string TraderIds { get; set; }

        public string MajorBettypeIds { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_API_TraderPerformance_Get";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}