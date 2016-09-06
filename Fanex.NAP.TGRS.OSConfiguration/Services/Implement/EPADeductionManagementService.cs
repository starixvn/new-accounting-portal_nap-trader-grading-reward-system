namespace Fanex.NAP.TGRS.OSConfiguration.Services.EPADeductionManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.EPADeductionManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement;
    using System.Collections.Generic;

    public class EPADeductionManagementService : TGRSBaseService, IEPADeductionManagementService
    {
        public IEnumerable<object> GetEPADeductionHistory()
        {
            return null;
        }

        public ICommandResult DeleteEPADeductionHistory()
        {
            return null;
        }

        public IEnumerable<object> GetErrorHistory()
        {
            return null;
        }

        public ICommandResult DeleteErrorHistory()
        {
            return null;
        }

        public IEnumerable<object> GetLeaveHistory()
        {
            return null;
        }

        public ICommandResult DeleteLeaveHistory()
        {
            return null;
        }

        public IEnumerable<object> GetErrorTypes()
        {
            return null;
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
    }
}