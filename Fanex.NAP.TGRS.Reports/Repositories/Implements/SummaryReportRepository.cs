// -----------------------------------------------------------------------
// <copyright file="SummaryReportRepository.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// <history>
//   <change who="Ken.Nguyen" date="2014.5.29">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Repositories.Implements
{
    using System.Collections;
    using System.Data;
    using Fanex.Data;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceSummary;
    using Fanex.NAP.TGRS.Reports.Reposistories.Interface;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class SummaryReportRepository :  ISummaryReportRepository
    {
        /// <summary>
        /// Get trader performance.
        /// </summary>
        /// <param name="criteria">Criteria that used to query trader performance.</param>
        /// <returns>Trader performance model.</returns>
        public TraderPerformance GetTraderPerformance(GetTraderPerformanceCriteria criteria)
        {
            TraderPerformance result = null;

            Hashtable param = criteria.GetSpParams();

            using (IObjectDb db = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var dataset = db.ExecuteDataSet(param))
                {
                    if (dataset.Tables.Count == 2)
                    {
                        DataTable listTopTrader = dataset.Tables[0];
                        DataTable listBottomTrader = dataset.Tables[1];
                        result = new TraderPerformance(listTopTrader.Rows[0], listBottomTrader.Rows[0]);
                    }
                }
            }
            return result;
        }
    }
}
