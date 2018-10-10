namespace Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement
{
    using Fanex.Data.Repository;

    public class DeleteLeaveHistoryCriteria : CriteriaBase
    {
        public int CreatorId { get; set; }

        public int LeaveId { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_TraderEmergencyLeaveDelete";
        }
    }
}
