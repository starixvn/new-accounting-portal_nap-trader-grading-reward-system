namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement
{
    using Fanex.Data.Repository;
    using System;

    public class GetLeaveHistoryCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override bool IsValid()
        {
            return TraderId > 0;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderEmergencyLeaveGet";
        }
    }
}
