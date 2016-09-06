namespace Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement
{
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;

    public interface IEPADeductionManagementService
    {
        IEnumerable<EPADeductionInfo> GetEPADeductionReport(GetAllEPADeductionCriteria criteria);

        IEnumerable<EPADeductionHistory> GetEPADeductionHistory(GetEPADeductionHistoryCriteria criteria);

        ICommandResult DeleteEPADeductionHistory();


        IEnumerable<ErrorHistory> GetErrorHistory(GetErrorHistoryCriteria criteria);

        ICommandResult DeleteErrorHistory();

        IEnumerable<LeaveHistory> GetLeaveHistory(GetLeaveHistoryCriteria criteria);

        ICommandResult DeleteLeaveHistory();

        IEnumerable<IssueInfo> GetErrorTypes(GetAllIssueCriteria criteria);

        ICommandResult InsertEPADeduction(InsertPointDeductionCriteria criteria);

        ICommandResult InsertError(InsertErrorCriteria criteria);

        ICommandResult InsertLeave(InsertEmergencyLeaveCriteria criteria);
    }
}