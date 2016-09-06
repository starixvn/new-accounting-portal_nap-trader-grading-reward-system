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

        IEnumerable<object> GetEPADeductionHistory();

        ICommandResult DeleteEPADeductionHistory();


        IEnumerable<object> GetErrorHistory();

        ICommandResult DeleteErrorHistory();

        IEnumerable<object> GetLeaveHistory();

        ICommandResult DeleteLeaveHistory();

        IEnumerable<IssueInfo> GetErrorTypes(GetAllIssueCriteria criteria);

        ICommandResult InsertEPADeduction();

        ICommandResult InsertError();

        ICommandResult InsertLeave();
    }
}