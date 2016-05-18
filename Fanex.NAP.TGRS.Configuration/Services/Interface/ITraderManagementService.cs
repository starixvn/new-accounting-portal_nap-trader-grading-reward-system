namespace Fanex.NAP.TGRS.Configuration.Services.TraderManagement
{
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement;

    public interface ITraderManagementService
    {
        TraderInfoList GetAllTrader(GetAllTradersCriteria criteria);

        ICommandResult InsertTrader(InsertTraderCriteria criteria);

        ICommandResult UpdateTrader(UpdateTraderCriteria criteria);

        IEnumerable<GradeHistoryItem> GetGradeHistory(GetGradeHistoryCriteria criteria);

        IEnumerable<TeamHistoryItem> GetTeamHistory(GetTeamHistoryCriteria criteria);
    }
}
