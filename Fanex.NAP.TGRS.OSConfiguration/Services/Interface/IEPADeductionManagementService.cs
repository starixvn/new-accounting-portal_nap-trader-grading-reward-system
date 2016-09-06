namespace Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;
    using System.Collections.Generic;

    public interface IEPADeductionManagementService
    {
        IEnumerable<EPADeductionInfo> GetEPADeductionReport(GetAllEPADeductionCriteria criteria);

        IEnumerable<EPADeductionHistory> GetEPADeductionHistory(GetEPADeductionHistoryCriteria criteria);

        ICommandResult DeleteEPADeductionHistory(DeleteEPADeductionHistoryCriteria criteria);

        IEnumerable<ErrorHistory> GetErrorHistory(GetErrorHistoryCriteria criteria);

        ICommandResult DeleteErrorHistory(DeleteErrorHistoryCriteria criteria);

        IEnumerable<LeaveHistory> GetLeaveHistory(GetLeaveHistoryCriteria criteria);

        ICommandResult DeleteLeaveHistory(DeleteLeaveHistoryCriteria criteria);

        IEnumerable<IssueInfo> GetErrorTypes(GetAllIssueCriteria criteria);

        ICommandResult InsertEPADeduction(InsertPointDeductionCriteria criteria);

        ICommandResult InsertError(InsertErrorCriteria criteria);

        ICommandResult InsertLeave(InsertEmergencyLeaveCriteria criteria);
    }
}