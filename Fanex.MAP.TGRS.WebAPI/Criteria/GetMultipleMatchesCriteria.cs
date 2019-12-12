namespace Fanex.NAP.TGRS.WebAPI.Criteria
{
    using Fanex.Data.Repository;
    using System;

    public class GetMultipleMatchesCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string TraderIds { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_API_MultipleMatches_Get";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}