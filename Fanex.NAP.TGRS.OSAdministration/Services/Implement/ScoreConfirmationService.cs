// --------------------------------------------------------------------------
// <copyright file="ScoreConfirmationService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Long.Luu" date="2016.8.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Services.Implement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreConfirmation;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreConfirmation;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreHistory;
    using Fanex.NAP.TGRS.OSAdministration.Services.Interface;
    using System.Collections.Generic;
    using System.Linq;

    public class ScoreConfirmationService : TGRSBaseService, IScoreConfirmationService
    {
        public LastestScoreHistoryInfo GetLastestScoreHistoryInfo(GetLastedScoreHistoryInfoCriteria criteria)
        {
            return GetData<LastestScoreHistoryInfo>(criteria).First();
        }

        public IEnumerable<TraderScoreInfo> GetTraderScores(GetAllTraderScoreCriteria criteria)
        {
            return GetData<TraderScoreInfo>(criteria);
        }

        public ICommandResult StoreTraderConfirmedScores(StoreTraderConfirmedScoreCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}
