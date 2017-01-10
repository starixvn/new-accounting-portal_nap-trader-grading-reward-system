namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.NewPerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using NPOI.SS.UserModel;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string GradePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewGradePerformance";
        private const int PointInPixel = 225;

        public IEnumerable<GradePerformanceInfo> GetGradePerformance(ICriteria criteria)
        {
            var result = this.GetData<GradePerformanceInfo>(criteria);

            result = result ?? new List<GradePerformanceInfo>();

            SessionManager.Set<IEnumerable<GradePerformanceInfo>>(GradePerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<GradeLeaguePerformanceInfo> GetGradeLeaguePerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeLeaguePerformanceInfo>(criteria);

            result = result ?? new List<GradeLeaguePerformanceInfo>();

            return result;
        }

        public IEnumerable<GradeLeagueTraderPerformanceInfo> GetGradeLeagueTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeLeagueTraderPerformanceInfo>(criteria);

            result = result ?? new List<GradeLeagueTraderPerformanceInfo>();

            return result;
        }

        public IEnumerable<GradeLeagueTraderMatchPerformanceInfo> GetGradeLeagueTraderMatchPerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeLeagueTraderMatchPerformanceInfo>(criteria);

            result = result ?? new List<GradeLeagueTraderMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<GradeLeagueMatchBettypePerformanceInfo> GetGradeLeagueTraderMatchBettypePerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeLeagueMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<GradeLeagueMatchBettypePerformanceInfo>();

            return result;
        }

        public IEnumerable<GradeTraderPerformanceInfo> GetGradeTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<GradeTraderPerformanceInfo>(criteria);

            result = result ?? new List<GradeTraderPerformanceInfo>();

            return result;
        }

        public Dictionary<string, IEnumerable<GradeTraderMatchPerformanceInfo>> GetGradeTraderMatchPerformance(ICriteria criteria)
        {
            var data = this.GetData<GradeTraderMatchPerformanceInfo>(criteria);
            var result = new Dictionary<string, IEnumerable<GradeTraderMatchPerformanceInfo>>();

            data = data ?? new List<GradeTraderMatchPerformanceInfo>();

            if (data.Count() > 0)
            {
                var groups = data.GroupBy(t => t.LeagueId);
                foreach (var group in groups)
                {
                    var leagueName = CacheRef.GetLeagueName(group.Key);
                    if (string.IsNullOrEmpty(leagueName))
                    {
                        leagueName = group.Key.ToString();
                    }

                    result.Add(leagueName, group.Select(t => t));
                }
            }

            return result;
        }

        public void ExportGradePerformance(GetGradePerformanceCriteria criteria, bool isViewScore, string templatePath)
        {
            var gradeData = SessionManager.Get<IEnumerable<GradePerformanceInfo>>(GradePerformanceDetailReportSessionKey);
            if (gradeData == null || (gradeData != null && gradeData.Count() == 0))
            {
                gradeData = this.GetData<GradePerformanceInfo>(criteria);

                gradeData = gradeData ?? new List<GradePerformanceInfo>();

                SessionManager.Set<IEnumerable<GradePerformanceInfo>>(GradePerformanceDetailReportSessionKey, gradeData);
            }

            if (gradeData != null && gradeData.Count() > 0)
            {
                string reportName = string.Format(
                                ViewLang.PerformanceDetailFileName,
                                ViewLang.League,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.LeaguePerformance);
                writer.CopyRows(0, 1);

                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowData(gradeData, ref writer, isViewScore);

                writer.SyncColumnsWidth(14);
                writer.Render();
            }
        }

        #region Private

        private void FillRowData(IEnumerable<GradePerformanceInfo> contentData, ref ExcelTemplateWriter writer, bool isViewScore)
        {
            decimal totalTO = 0, totalJuice = 0, totalWL = 0;
            int totalTrader = 0, totalMatch = 0, totalBetcount = 0, totalLeague = 0, len = contentData.Count();

            for (int i = 0; i < len; i++)
            {
                var styleIndex = (i % 2 == 0) ? 5 : 6;
                var item = contentData.ElementAt(i);
                var record = new object[]
                {
                    i + 1,
                    (int)item.Grade, item.TraderCount, item.LeagueCount, item.MatchCount, item.Turnover,
                    item.Juice,
                    (object)item.JuiceMargin ?? ViewLang.NA,
                    item.Leftover,
                    (object)item.LeftoverMargin ?? ViewLang.NA,
                    item.WinLoss,
                    (object)item.Margin ?? ViewLang.NA,
                    item.BetCount,
                    isViewScore ? (object)item.Score ?? ViewLang.NA : ViewLang.NA
                };
                writer.WriteRow(styleIndex, record);

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalTrader += item.TraderCount;
                totalLeague += item.LeagueCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;
            }

            var totalRecord = new object[]
            {
                ViewLang.GrandTotal, null,
                totalTrader,
                totalLeague,
                totalMatch,
                totalTO,
                totalJuice,
                totalTO > 0 ? (object)(totalJuice / totalTO * 100) : ViewLang.NA,
                totalWL - totalJuice,
                totalTO > 0 ? (object)((totalWL - totalJuice) / totalTO * 100) : ViewLang.NA,
                totalWL,
                totalTO > 0 ? (object)(totalWL / totalTO * 100) : ViewLang.NA,
                totalBetcount
            };
            writer.WriteRow(7, totalRecord);
        }

        private void FilterBlock(GetGradePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            var contentRender = new RichTextRender().Clear();
            var boldFont = writer.GetFont(11, 0);
            var normalFont = writer.GetFont(12, 0);
            var lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");

            var contentRichTextString = contentRender.Render();
            var contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        #endregion Private
    }
}