// --------------------------------------------------------------------------
// <copyright file="GradeDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;

    /// <summary>
    /// Detail report service.
    /// </summary>
    public partial class DetailReportService : TGRSBaseService, IDetailReportService
    {
        private const string GradePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.GradePerformance";

        /// <summary>
        /// Gets the grade performance.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>GradePerformanceList object.</returns>
        public GradePerformanceList GetGradePerformance(GetGradePerformanceCriteria criteria)
        {
            IEnumerable<GradePerformanceInfo> gradeData = this.GetData<GradePerformanceInfo>(criteria);
            GradePerformanceList gradePerformance = new GradePerformanceList();

            if (gradeData != null && gradeData.Any())
            {
                foreach (GradePerformanceInfo item in gradeData)
                {
                    gradePerformance.AddItem(new GradePerformanceItem(item));
                }

                gradePerformance.Total.Margin = CalculateTotalMargin(gradePerformance.Total.WinLoss, gradePerformance.Total.Turnover);
                SessionManager.Set<GradePerformanceList>(GradePerformanceDetailReportSessionKey, gradePerformance);
            }

            return gradePerformance;
        }

        /// <summary>
        /// Gets the trader performance of a grade.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>TraderPerformanceList object.</returns>
        public TraderPerformanceList GetTraderPerformanceOfGrade(GetTraderPerformanceOfGradeCriteria criteria)
        {
            IEnumerable<TraderPerformanceInfo> traderData = this.GetData<TraderPerformanceInfo>(criteria);
            TraderPerformanceList traderPerformance = new TraderPerformanceList();

            if (traderData != null && traderData.Any())
            {
                foreach (TraderPerformanceInfo item in traderData)
                {
                    traderPerformance.AddItem(new TraderPerformanceItem(item));
                }

                traderPerformance.Total.Margin = CalculateTotalMargin(traderPerformance.Total.WinLoss, traderPerformance.Total.Turnover);
            }

            return traderPerformance;
        }

        /// <summary>
        /// Gets the match performance of a pair of grade and trader.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>MatchPerformanceGroup object.</returns>
        public MatchPerformanceGroup GetMatchPerformanceOfGradeTrader(GetMatchPerformanceOfGradeTraderCriteria criteria)
        {
            IEnumerable<MatchPerformanceInfo> matchData = this.GetData<MatchPerformanceInfo>(criteria);
            MatchPerformanceGroup matchPerformance = new MatchPerformanceGroup();

            if (matchData != null && matchData.Any())
            {
                foreach (MatchPerformanceInfo item in matchData)
                {
                    matchPerformance.AddItem(new MatchPerformanceItem(item));
                }

                matchPerformance.Total.Margin = CalculateTotalMargin(matchPerformance.Total.WinLoss, matchPerformance.Total.Turnover);
            }

            return matchPerformance;
        }

        /// <summary>
        /// Export Grade Performance to excel.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <param name="templateUrl">Path to Excel template file.</param>
        public void ExportGradePerformance(GetGradePerformanceCriteria criteria, string templateUrl)
        {
            GradePerformanceList gradeData = SessionManager.Get<GradePerformanceList>(GradePerformanceDetailReportSessionKey);

            if ((gradeData != null) && (gradeData.ItemList.Count > 0))
            {
                string reportName = string.Format(
                                    ViewLang.PerformanceDetailFileName,
                                    ViewLang.Grade,
                                    criteria.FromDate.ToShortFormatedDateForFileName(),
                                    criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templateUrl, reportName, ViewLang.GradePerformance);
                writer.CopyRows(0, 4);

                // Write content.
                FillRowData(gradeData, ref writer);

                writer.SyncColumnsWidth(9);
                writer.Render();
            }
        }

        /// <summary>
        /// Fills the content row.
        /// </summary>
        /// <param name="contentData">The content data.</param>
        /// <param name="writer">The writer that is used to write Excel content.</param>
        private void FillRowData(GradePerformanceList contentData, ref ExcelTemplateWriter writer)
        {
            // Content rows
            int len = contentData.ItemList.Count;
            GradePerformanceItem item;

            for (int i = 0; i < len; i++)
            {
                int styleIndex = (i % 2 == 0) ? 4 : 5;
                item = contentData.ItemList[i];

                var record = new object[]
                {
                    i + 1,
                    item.Grade,
                    item.NoOfTraders,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.Turnover,
                    item.WinLoss,
                    item.BetCount,
                    item.Margin
                };
                writer.WriteRow(styleIndex, record);
            }

            // Total row
            GradePerformanceItem total = contentData.Total;
            var totalRecord = new object[]
            {
                ViewLang.GrandTotal,
                null,
                total.NoOfTraders,
                total.NoOfLeagues,
                total.NoOfMatches,
                total.Turnover,
                total.WinLoss,
                total.BetCount,
                (object)total.Margin ?? ViewLang.NA
            };
            writer.WriteRow(6, totalRecord);
        }
    }
}