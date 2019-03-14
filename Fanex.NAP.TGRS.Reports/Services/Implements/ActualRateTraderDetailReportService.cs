namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Core.Web;
    using Fanex.Data.Repository;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.ActualRatePerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using NPOI.SS.UserModel;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System;

    public partial class ActualRateDetailReportService : TGRSBaseService, IActualRateDetailReportService
    {
        #region Constants
        private const string TraderPerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.ActualRateTraderPerformance";
        private const int PointInPixel = 225;

        #endregion Constants        

        #region Trader Performance
        public IEnumerable<TraderPerformanceInfo> GetTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<TraderPerformanceInfo>(criteria);

            if (!(criteria as GetActualRateTraderPerformanceCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            SessionManager.Set<IEnumerable<TraderPerformanceInfo>>(TraderPerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(ICriteria criteria)
        {
            var result = this.GetData<MatchPerformanceInfo>(criteria);

            if (!(criteria as GetActualRateTraderMatchPerformanceCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            return result;
        }

        public IEnumerable<TraderMatchBetTypePerformanceInfo> GetTraderMatchBettypePerformance(ICriteria criteria)
        {
            var result = this.GetData<TraderMatchBetTypePerformanceInfo>(criteria);

            if (!(criteria as GetActualRateTraderMatchBettypePerformanceCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            return result;
        }

        public void ExportTraderPerformance(GetActualRateTraderPerformanceCriteria criteria, string templatePath, bool isViewScore = true)
        {
            var traderData = SessionManager.Get<IEnumerable<TraderPerformanceInfo>>(TraderPerformanceDetailReportSessionKey);

            if ((traderData != null) && (traderData.Count() > 0))
            {
                //sort desc field Margin before export data to excel, because this is set default for javascript display into grid
                traderData = traderData.OrderByDescending(c => c.Margin);

                string reportName = string.Format(
                                ViewLang.ActualRatePerformanceDetailFileName,
                                ViewLang.TraderActualRate,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.NewTraderPerformance);
                writer.CopyRows(0, 1);
                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowData(traderData, ref writer, isViewScore);
                //total column in the file is 19
                writer.SyncColumnsWidth(19);

                if (!isViewScore)
                {
                    writer.SetColumnHidden(14);
                }

                writer.Render();
            }
        }
        #endregion Trader Performance

        #region Private functions
        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 2);
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FillRowData(IEnumerable<TraderPerformanceInfo> contentData, ref ExcelTemplateWriter writer, bool isViewScore)
        {
            // Content rows
            int dataLength = contentData.ToList().Count;
            TraderPerformanceInfo item;
            decimal totalTO = 0, totalTOJuice = 0, totalTOLeftover = 0, totalJuice = 0, totalLeftover = 0, totalWL = 0;
            int? totalLeague = 0, totalMatch = 0, totalBetcount = 0;

            for (int i = 0; i < dataLength; i++)
            {
                int styleIndex = (i % 2 == 0) ? 5 : 6;
                item = contentData.ElementAt(i);

                totalTO += item.Turnover;
                totalTOJuice += item.TurnoverJuice;
                totalTOLeftover += item.TurnoverLeftover;
                totalLeftover += item.WinlostLeftover;
                totalJuice += item.Juice;
                totalWL += item.WinLoss;
                totalLeague += item.LeagueCount;
                totalMatch += item.MatchCount;
                totalBetcount += item.BetCount;

                var record = new object[]
                {
                    i + 1,
                    item.Username,
                    (int)item.Grade,
                    item.TeamName,
                    item.LeagueCount,
                    item.MatchCount,
                    item.TurnoverJuice,
                    item.Juice,
                    (object)item.JuiceMargin ?? ViewLang.NA,
                    (object)item.JuiceMarginTotal ?? ViewLang.NA,
                    item.TurnoverLeftover,
                    item.WinlostLeftover,
                    (object)item.LeftoverMargin ?? ViewLang.NA,
                    (object)item.LeftoverMarginTotal ?? ViewLang.NA,
                    item.Turnover,
                    item.WinLoss,
                    (object)item.Margin ?? ViewLang.NA,
                    item.BetCount,
                    isViewScore ? (object)item.Score ?? ViewLang.NA : ViewLang.NA
                };
                writer.WriteRow(styleIndex, record);
            }

            var totalRecord = new object[]
            {
                ViewLang.GrandTotal,
                null,
                null,
                null,
                totalLeague,
                totalMatch,
                totalTOJuice,
                totalJuice,
                totalTOJuice > 0 ? (object)(totalJuice / totalTOJuice * 100) : ViewLang.NA,
                totalTO > 0 ? (object)(totalJuice / totalTO * 100) : ViewLang.NA,
                totalTOLeftover,
                totalLeftover,
                totalTOLeftover > 0 ? (object)(totalLeftover / totalTOLeftover * 100) : ViewLang.NA,
                totalTO > 0 ? (object)(totalLeftover / totalTO * 100) : ViewLang.NA,
                totalTO,
                totalWL,
                totalTO > 0 ? (object)(totalWL / totalTO * 100) : ViewLang.NA,
                totalBetcount,
                string.Empty
            };
            writer.WriteRow(7, totalRecord);
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(GetActualRateTraderPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");

            //// Trader
            string userNameString = (criteria.Username != null) ? string.Format("contains '{0}'", criteria.Username) : string.Empty;
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Trader, boldFont, userNameString, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
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
        #endregion Private functions
    }
}
