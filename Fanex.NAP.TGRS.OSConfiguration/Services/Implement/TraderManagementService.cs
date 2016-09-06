namespace Fanex.NAP.TGRS.OSConfiguration.Services.TraderManagement
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
            var criteria = new GetTraderCriteria()
            {
                GradeId = -1,
                TeamId = -1,
                TraderName = string.Empty
            };

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

        public IEnumerable<TeamHistory> GetTraderTeamHistories(GetTeamHistoryCriteria criteria)
        {
            return GetData<TeamHistory>(criteria);
        }

        public IEnumerable<GradeHistory> GetTraderGradeHistories(GetGradeHistoryCriteria criteria)
        {
            return GetData<GradeHistory>(criteria);
        }

        public IEnumerable<Issue> GetTraderErrors(GetErrorCriteria criteria)
        {
            return GetData<Issue>(criteria);
        }

        public IEnumerable<Issue> GetTraderEPADeductions(GetEPADeductionCriteria criteria)
        {
            return GetData<Issue>(criteria);
        }

        public IEnumerable<TraderInfo> GetTraderByNameTeamGrade(GetTraderCriteria criteria)
        {
            criteria.TraderName = criteria.TraderName ?? string.Empty;

            return GetData<TraderInfo>(criteria);
        }
    }
}