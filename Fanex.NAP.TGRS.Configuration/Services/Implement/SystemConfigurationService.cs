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
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration;
    using Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.Models.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;
    using Fanex.NAP.TGRS.Configuration.Models.SystemConfiguration;
    using Fanex.Common;
    using System.Web;

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
            //// Tmp, save session
            string betTypesSessionKey = "Fanex.NAP.TGRS.Reports.BetTypes";
            List<BetTypeItem> betTypes = SessionManager.Get<List<BetTypeItem>>(betTypesSessionKey);
            var selectedBettype = criteria.BetTypes.Split(',');
            if (betTypes != null)
            {
                foreach (var item in betTypes)
                {
                    if (selectedBettype.Contains(item.BetTypeId.ToString()) || criteria.BetTypes == "0")
                    {
                        item.IsDefaultCheck = true;
                    }
                    else
                    {
                        item.IsDefaultCheck = false;
                    }
                }

                SessionManager.Set<List<BetTypeItem>>(betTypesSessionKey, betTypes);
            }

            return null;
        }

        public List<ScoreCalculationPeriod> GetScoreCalculationPeriod()
        {
            return this.GetData<ScoreCalculationPeriod>(new ScoreCalculationPeriodCriteria()).ToList();
        }

        public ICommandResult UpdateScoreCalculationPeriod(UpdateScoreCalculationPeriodCriteria criteria)
        {
            criteria.BeginDay = Converter.ToDateTime(criteria.BeginDay).ToString("yyyy-MM-dd");
            criteria.EndDay = Converter.ToDateTime(criteria.EndDay).ToString("yyyy-MM-dd");
            criteria.SelectedDay = Converter.ToDateTime(criteria.SelectedDay).ToString("yyyy-MM-dd");
            return this.UpdateData(criteria);
        }
    }
}