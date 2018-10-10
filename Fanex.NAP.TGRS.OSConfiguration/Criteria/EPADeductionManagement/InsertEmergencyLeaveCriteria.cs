namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement
{
    using System;
    using Fanex.Data.Repository;

    public class InsertEmergencyLeaveCriteria : CriteriaBase
    {
        public int CreatorId { get; set; }

        public int TraderId { get; set; }

        public DateTime LeaveDate { get; set; }

        public string Reason { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderEmergencyLeaveInsert";
        }
    }
}
