// --------------------------------------------------------------------------
// <copyright file="IScoreConfirmationService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.8.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Services.Interface
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreConfirmation;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreConfirmation;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreHistory;
    using System.Collections.Generic;

    public interface IScoreConfirmationService
    {
        LastestScoreHistoryInfo GetLastestScoreHistoryInfo(GetLastedScoreHistoryInfoCriteria criteria);

        IEnumerable<TraderScoreInfo> GetTraderScores(GetAllTraderScoreCriteria criteria);

        ICommandResult StoreTraderConfirmedScores(StoreTraderConfirmedScoreCriteria criteria);
    }
}
