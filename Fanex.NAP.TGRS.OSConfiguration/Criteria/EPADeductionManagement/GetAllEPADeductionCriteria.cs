namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement
{
    using Fanex.Data.Repository;
    using System;

    public class GetAllEPADeductionCriteria : CriteriaBase
    {
        public string TraderName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderEPADeductionGet";
        }
    }
}
