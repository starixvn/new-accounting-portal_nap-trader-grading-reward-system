namespace Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement
{
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;

    public class EPADeductionManagementService : TGRSBaseService, IEPADeductionManagementService
    {
        public ICommandResult DeleteEPADeductionHistory()
        {
            return null;
        }

        public ICommandResult DeleteErrorHistory()
        {
            return null;
        }

        public ICommandResult DeleteLeaveHistory()
        {
            return null;
        }

        public IEnumerable<IssueInfo> GetErrorTypes(GetAllIssueCriteria criteria)
        {
            return GetData<IssueInfo>(criteria);
        }

        public ICommandResult InsertEPADeduction()
        {
            return null;
        }

        public ICommandResult InsertError()
        {
            return null;
        }

        public ICommandResult InsertLeave()
        {
            return null;
        }

        public IEnumerable<EPADeductionInfo> GetEPADeductionReport(GetAllEPADeductionCriteria criteria)
        {
            return this.GetData<EPADeductionInfo>(criteria);
        }

        public IEnumerable<EPADeductionHistory> GetEPADeductionHistory(GetEPADeductionHistoryCriteria criteria)
        {
            return this.GetData<EPADeductionHistory>(criteria);
        }

        public IEnumerable<ErrorHistory> GetErrorHistory(GetErrorHistoryCriteria criteria)
        {
            return this.GetData<ErrorHistory>(criteria);
        }

        public IEnumerable<LeaveHistory> GetLeaveHistory(GetLeaveHistoryCriteria criteria)
        {
            return this.GetData<LeaveHistory>(criteria);
        }
    }
}