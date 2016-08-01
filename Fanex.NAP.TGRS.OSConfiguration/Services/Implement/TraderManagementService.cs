using Fanex.NAP.TGRS.OSConfiguration.Services.Interface;

namespace Fanex.NAP.TGRS.OSConfiguration.Services.GradeManagement
{
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Services.TeamManagement;

    public class TraderManagementService : TGRSBaseService, ITraderManagementService
    {
        public IEnumerable<TraderInfo> GetAllTrader()
        {
            var criteria = new GetTraderAllCriteria();

            return GetData<TraderInfo>(criteria);
        }

        public ICommandResult InsertTrader(InsertTraderCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public ICommandResult UpdateTrader(UpdateTraderCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public IEnumerable<History> GetTraderTeamHistories(GetTeamHistoryCriteria criteria)
        {
            return GetData<History>(criteria);
        }

        public IEnumerable<History> GetTraderGradeHistories(GetGradeHistoryCriteria criteria)
        {
            return GetData<History>(criteria);
        }

        public IEnumerable<Issue> GetTraderErrors(GetErrorCriteria criteria)
        {
            return GetData<Issue>(criteria);
        }

        public IEnumerable<Issue> GetTraderEPADeductions(GetEPADeductionCriteria criteria)
        {
            return GetData<Issue>(criteria);
        }
    }
}