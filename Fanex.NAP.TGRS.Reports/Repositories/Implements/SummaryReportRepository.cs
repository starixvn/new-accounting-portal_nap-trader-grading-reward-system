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
    using Fanex.NAP.TGRS.Reports.Repositories.Interface;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceSummary;

    /// <summary>
    /// Trader Management Service.
    /// </summary>
    public class SummaryReportRepository : ISummaryReportRepository
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

        /// <summary>
        /// Get grade history of trader.
        /// </summary>
        /// <param name="criteria">Criteria that used to query trader performance.</param>
        /// <returns>Grade history model.</returns>
        public GradeHistory GetGradeHistory(GetGradeHistoryCriteria criteria)
        {
            GradeHistory result = null;

            Hashtable param = criteria.GetSpParams();

            using (IObjectDb db = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var dataset = db.ExecuteDataSet(param))
                {
                    if (dataset.Tables.Count == 2)
                    {
                        result = new GradeHistory();
                        DataTable list = dataset.Tables[0];
                        foreach (DataRow row in list.Rows)
                        {
                            var gradeHistoryGeneral = new GradeHistoryGeneral(row);
                            result.AddGradeHistoryGeneral(gradeHistoryGeneral);
                        }

                        list = dataset.Tables[1];
                        foreach (DataRow row in list.Rows)
                        {
                            var gradeHistoryDetail = new GradeHistoryDetail(row);
                            result.AddGradeHistoryDetail(gradeHistoryDetail);
                        }
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Get Team history of trader.
        /// </summary>
        /// <param name="criteria">Criteria that used to query trader performance.</param>
        /// <returns>Team history model.</returns>
        public TeamHistory GetTeamHistory(GetTeamHistoryCriteria criteria)
        {
            TeamHistory result = null;

            Hashtable param = criteria.GetSpParams();

            using (IObjectDb db = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var dataset = db.ExecuteDataSet(param))
                {
                    if (dataset.Tables.Count == 2)
                    {
                        result = new TeamHistory();
                        DataTable list = dataset.Tables[0];
                        foreach (DataRow row in list.Rows)
                        {
                            var teamHistoryGeneral = new TeamHistoryGeneral(row);
                            result.AddTeamHistoryGeneral(teamHistoryGeneral);
                        }

                        list = dataset.Tables[1];
                        foreach (DataRow row in list.Rows)
                        {
                            var teamHistoryDetail = new TeamHistoryDetail(row);
                            result.AddTeamHistoryDetail(teamHistoryDetail);
                        }
                    }
                }
            }

            return result;
        }
    }
}
