namespace Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;
    using System.Collections.Generic;

    public class EPADeductionManagementService : TGRSBaseService, IEPADeductionManagementService
    {
        public ICommandResult DeleteEPADeductionHistory(DeleteEPADeductionHistoryCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult DeleteErrorHistory(DeleteErrorHistoryCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult DeleteLeaveHistory(DeleteLeaveHistoryCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public IEnumerable<IssueInfo> GetErrorTypes(GetAllIssueCriteria criteria)
        {
            return GetData<IssueInfo>(criteria);
        }

        public ICommandResult InsertEPADeduction(InsertPointDeductionCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult InsertError(InsertErrorCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult InsertLeave(InsertEmergencyLeaveCriteria criteria)
        {
            return this.UpdateData(criteria);
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