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
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string LeaguePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewLeaguePerformance";
        private const int PointInPixel = 225;

        public IEnumerable<LeaguePerformanceInfo> GetLeaguePerformance(ICriteria criteria)
        {
            var result = this.GetData<LeaguePerformanceInfo>(criteria);

            result = result ?? new List<LeaguePerformanceInfo>();

            SessionManager.Set<IEnumerable<LeaguePerformanceInfo>>(LeaguePerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<LeagueTraderPerformanceInfo> GetTraderPerformanceByLeague(ICriteria criteria)
        {
            var result = this.GetData<LeagueTraderPerformanceInfo>(criteria);

            result = result ?? new List<LeagueTraderPerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueTraderMatchPerformanceInfo> GetMatchPerformanceOfLeagueAndTrader(ICriteria criteria)
        {
            var result = this.GetData<LeagueTraderMatchPerformanceInfo>(criteria);

            result = result ?? new List<LeagueTraderMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueTraderMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueTraderAndMatch(ICriteria criteria)
        {
            var result = this.GetData<LeagueTraderMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<LeagueTraderMatchBettypePerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueMatchPerformanceInfo> GetMatchPerformanceOfLeague(ICriteria criteria)
        {
            var result = this.GetData<LeagueMatchPerformanceInfo>(criteria);

            result = result ?? new List<LeagueMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueAndMatch(ICriteria criteria)
        {
            var result = this.GetData<LeagueMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<LeagueMatchBettypePerformanceInfo>();

            return result;
        }

        public void ExportLeaguePerformance(GetLeaguePerformanceCriteria criteria, string templatePath)
        {
            var leagueData = SessionManager.Get<IEnumerable<LeaguePerformanceInfo>>(LeaguePerformanceDetailReportSessionKey);

            if (leagueData != null && leagueData.Count() > 0)
            {
                string reportName = string.Format(
                                ViewLang.NewPerformanceDetailFileName,
                                ViewLang.League,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.NewLeaguePerformance);
                writer.CopyRows(0, 1);

                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowData(leagueData, ref writer);

                writer.SyncColumnsWidth(12);
                writer.Render();
            }
        }

        #region Private
        private void FilterBlock(GetLeaguePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            var contentRender = new RichTextRender().Clear();
            var boldFont = writer.GetFont(11, 0);
            var normalFont = writer.GetFont(12, 0);
            var leagueString = (criteria.LeagueName != null) ? string.Format("contains '{0}'", criteria.LeagueName) : string.Empty;
            var lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.League, boldFont, leagueString, normalFont, "\n");

            var contentRichTextString = contentRender.Render();
            var contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 2);
        }

        private void FillRowData(IEnumerable<LeaguePerformanceInfo> data, ref ExcelTemplateWriter writer)
        {
            var len = data.Count();
            decimal totalTO = 0, totalJuice = 0, totalWL = 0; 
            int totalTrader = 0, totalMatch = 0, totalBetcount = 0;

            for (int i = 0; i < len; i++)
            {
                int styleIndex = (i % 2 == 0) ? 5 : 6;
                var item = data.ElementAt(i);
                var record = new object[]
                {
                    i + 1,
                    item.LeagueName,
                    item.TraderCount,
                    item.MatchCount,
                    item.Turnover,
                    item.Juice,
                    (object)item.JuiceMargin ?? ViewLang.NA,
                    item.Leftover,
                    (object)item.LeftoverMargin ?? ViewLang.NA,
                    item.WinLoss,
                    (object)item.Margin ?? ViewLang.NA,
                    item.BetCount
                };
                writer.WriteRow(styleIndex, record);

                totalTO += item.Turnover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalTrader += item.TraderCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;
            }

            var totalRecord = new object[]
            {
                ViewLang.GrandTotal, null,
                totalTrader,
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

        private void AppendBlockContent(ref RichTextRender content, ref int lineCount, string name, IFont nameFont, string value, IFont valueFont, string endString)
        {
            if (string.IsNullOrEmpty(value))
            {
                return;
            }

            // Name
            TextBlock nameBlock = new TextBlock(name + ":  ", nameFont);
            content = content.AddText(nameBlock);

            // Value
            TextBlock valueBlock = new TextBlock(value, valueFont);
            content = content.AddText(valueBlock);

            if (!string.IsNullOrEmpty(endString))
            {
                content = content.AddText(endString);
            }

            lineCount += CountLine(name + value);
        }

        private int CountLine(string line)
        {
            int charPerLine = 216; // Number char per line in filter block - use to calculate number of line
            return Convert.ToInt32(Math.Ceiling((float)line.Length / charPerLine));
        }
        #endregion Private
    }
}