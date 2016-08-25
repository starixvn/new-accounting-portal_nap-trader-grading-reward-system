// --------------------------------------------------------------------------
// <copyright file="IScoreHistoryService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.8.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Services.Interface
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreHistory;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreHistory;
    using System.Collections.Generic;

    public interface IScoreHistoryService
    {
        IList<ScoreHistoryInfo> GetAllScoreHistory();

        IList<TraderScoreInfo> GetScoreHistoryDetailByPeriod(GetScoreHistoryDetailByPeriodCriteria criteria);

        ICommandResult DeleteScoreHistory(DeleteScoreHistoryCriteria criteria);
    }
}
