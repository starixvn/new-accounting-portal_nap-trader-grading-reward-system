// -----------------------------------------------------------------------
// <copyright file="SystemConfigurationService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.12.04">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Common;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.LeagueExclusion;
    using Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration;
    using Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.Models.SystemConfiguration;
    using Fanex.NAP.TGRS.Configuration.Models.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class SystemConfigurationService : TGRSBaseService, ISystemConfigurationService
    {
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
        /// Updates the default bet type.
        /// </summary>
        /// <param name="criteria">The criteria.</param>
        /// <returns>The result of action.</returns>
        public ICommandResult UpdateDefaultBettype(UpdateDefaultBettypeCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        public List<ScoreCalculationPeriod> GetScoreCalculationPeriod(ScoreCalculationPeriodCriteria criteria)
        {
            return this.GetData<ScoreCalculationPeriod>(criteria).ToList();
        }

        public ICommandResult UpdateScoreCalculationPeriod(UpdateScoreCalculationPeriodCriteria criteria)
        {
            criteria.BeginDay = Converter.ToDateTime(criteria.BeginDay).ToString("yyyy-MM-dd");
            criteria.EndDay = Converter.ToDateTime(criteria.EndDay).ToString("yyyy-MM-dd");
            criteria.SelectedDay = Converter.ToDateTime(criteria.SelectedDay).ToString("yyyy-MM-dd");
            return this.UpdateData(criteria);
        }

        public bool GetLeagueExclusionConfig()
        {
            var result = GetSingle<dynamic>(new LeagueExclusionConfigGetCriteria());
            return result.IsExcludeLeagues == "1" ? true : false;
        }

        public ICommandResult UpdateLeagueExclusionConfig(int userId, bool onOffValue)
        {
            var criteria = new LeagueExclusionConfigUpdateCriteria { UserId = userId, OnOffValue = onOffValue };

            return UpdateData(criteria);
        }
    }
}