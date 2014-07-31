// -----------------------------------------------------------------------
// <copyright file="TraderManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.TraderManagement
{
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.Models.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.Services.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class TraderManagementService : TGRSBaseService, ITraderManagementService
    {
        /// <summary>
        /// Get all Trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of Trader information.</returns>
        public TraderInfoList GetAllTrader(GetAllTradersCriteria criteria)
        {
            TraderInfoList result = null;

            var rawData = this.GetData<TraderInfo>(criteria);

            if (rawData != null)
            {
                result = new TraderInfoList();

                foreach (TraderInfo trader in rawData)
                {
                    var traderInfoItem = new TraderInfoItem(trader);

                    result.Add(traderInfoItem);
                }
            }

            return result;
        }

        /// <summary>
        /// Get team history of trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of Trader information.</returns>
        public IEnumerable<TeamHistoryItem> GetTeamHistory(GetTeamHistoryCriteria criteria)
        {
            List<TeamHistoryItem> result = null;

            var rawData = this.GetData<TeamHistory>(criteria);

            if (rawData != null)
            {
                result = new List<TeamHistoryItem>();

                foreach (TeamHistory teamHistory in rawData)
                {
                    var teamHistoryItem = new TeamHistoryItem(teamHistory);

                    result.Add(teamHistoryItem);
                }
            }

            return result;
        }

        /// <summary>
        /// Get grade history of trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of Trader information.</returns>
        public IEnumerable<GradeHistoryItem> GetGradeHistory(GetGradeHistoryCriteria criteria)
        {
            List<GradeHistoryItem> result = null;

            var rawData = this.GetData<GradeHistory>(criteria);

            if (rawData != null)
            {
                result = new List<GradeHistoryItem>();

                foreach (GradeHistory gradeHistory in rawData)
                {
                    var gradeHistoryItem = new GradeHistoryItem(gradeHistory);

                    result.Add(gradeHistoryItem);
                }
            }

            return result;
        }

        /// <summary>
        /// Insert new Trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to insert data.</param>
        /// <returns>Result of insert.</returns>
        public ICommandResult InsertTrader(InsertTraderCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        /// <summary>
        /// Update new Trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to update data.</param>
        /// <returns>Result of update.</returns>
        public ICommandResult UpdateTrader(UpdateTraderCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}
