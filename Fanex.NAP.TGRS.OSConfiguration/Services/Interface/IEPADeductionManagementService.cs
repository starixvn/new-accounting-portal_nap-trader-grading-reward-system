namespace Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement;
    using System.Collections.Generic;

    public interface IEPADeductionManagementService
    {
        IEnumerable<EPADeductionInfo> GetEPADeductionReport(GetAllEPADeductionCriteria criteria);

        IEnumerable<object> GetEPADeductionHistory();

        ICommandResult DeleteEPADeductionHistory();


        IEnumerable<object> GetErrorHistory();

        ICommandResult DeleteErrorHistory();

        IEnumerable<object> GetLeaveHistory();

        ICommandResult DeleteLeaveHistory();

        IEnumerable<object> GetErrorTypes();

        ICommandResult InsertEPADeduction();

        ICommandResult InsertError();

        ICommandResult InsertLeave();
    }
}