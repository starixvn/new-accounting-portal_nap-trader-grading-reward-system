using Fanex.NAP.TGRS.OSConfiguration.Criteria.TraderManagement;
using Fanex.NAP.TGRS.OSConfiguration.Models.TraderManagement;

namespace Fanex.NAP.TGRS.OSConfiguration.Services.TeamManagement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.OSConfiguration.Criteria.TeamManagement;
    using Fanex.NAP.TGRS.OSConfiguration.Models.TeamManagement;
    using System.Collections.Generic;

    public interface ITraderManagementService
    {
        IEnumerable<TraderInfo> GetAllTrader();

        ICommandResult InsertTrader(InsertTraderCriteria criteria);

        ICommandResult UpdateTrader(UpdateTraderCriteria criteria);

        IEnumerable<History> GetTraderTeamHistories(GetTeamHistoryCriteria criteria);

        IEnumerable<History> GetTraderGradeHistories(GetGradeHistoryCriteria criteria);

        IEnumerable<Issue> GetTraderErrors(GetErrorCriteria criteria);

        IEnumerable<Issue> GetTraderEPADeductions(GetEPADeductionCriteria criteria);

        IEnumerable<TraderInfo> GetTraderByNameTeamGrade(GetTraderCriteria criteria);
    }
}
