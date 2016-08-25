// --------------------------------------------------------------------------
// <copyright file="ScoreHistoryService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.8.25">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSAdministration.Services.Implement
{
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSAdministration.Criteria.ScoreHistory;
    using Fanex.NAP.TGRS.OSAdministration.Models.ScoreHistory;
    using Fanex.NAP.TGRS.OSAdministration.Services.Interface;
    using System.Collections.Generic;
    using System.Linq;

    public class ScoreHistoryService : TGRSBaseService, IScoreHistoryService
    {
        public IList<ScoreHistoryInfo> GetAllScoreHistory()
        {
            var result = this.GetData<ScoreHistoryInfo>(new GetAllScoreHistoryCriteria());

            return result != null ? result.ToList() : new List<ScoreHistoryInfo>();
        }

        public IList<TraderScoreInfo> GetScoreHistoryDetailByPeriod(GetScoreHistoryDetailByPeriodCriteria criteria)
        {
            var result = this.GetData<TraderScoreInfo>(criteria);

            return result != null ? result.ToList() : new List<TraderScoreInfo>();
        }

        public ICommandResult DeleteScoreHistory(DeleteScoreHistoryCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}
