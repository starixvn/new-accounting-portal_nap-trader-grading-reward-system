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
        private const string TraderPerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewTraderPerformance";

        public IEnumerable<TraderPerformanceInfo> GetTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<TraderPerformanceInfo>(criteria);
            SessionManager.Set<IEnumerable<TraderPerformanceInfo>>(TraderPerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(ICriteria criteria)
        {
            return this.GetData<MatchPerformanceInfo>(criteria);
        }

        public IEnumerable<TraderMatchBetTypePerformanceInfo> GetTraderMatchBettypePerformance(ICriteria criteria)
        {
            return this.GetData<TraderMatchBetTypePerformanceInfo>(criteria);
        }

        public void ExportTraderPerformance(GetTraderPerformanceCriteria criteria, string templatePath, bool isViewScore = true)
        {
            var traderData = SessionManager.Get<IEnumerable<TraderPerformanceInfo>>(TraderPerformanceDetailReportSessionKey).ToList();

            if ((traderData != null) && (traderData.Count > 0))
            {
                string reportName = string.Format(
                                ViewLang.NewPerformanceDetailFileName,
                                ViewLang.Trader,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.NewTraderPerformance);
                writer.CopyRows(0, 1);
                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowData(traderData, ref writer);
                writer.SyncColumnsWidth(15);
                writer.Render();
            }
        }

        #region Private functions
        private void FillRowData(IEnumerable<TraderPerformanceInfo> contentData, ref ExcelTemplateWriter writer)
        {
            // Content rows
            int dataLength = contentData.ToList().Count;
            TraderPerformanceInfo item;
            decimal? totalTO = 0, totalJuice = 0, totalWL = 0, totalLeague = 0, totalMatch = 0, totalBetcount = 0;

            for (int i = 0; i < dataLength; i++)
            {
                int styleIndex = (i % 2 == 0) ? 5 : 6;
                item = contentData.ElementAt(i);
                totalTO += item.Turnover;
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
                    item.Turnover,
                    item.Juice,
                    item.JuiceMargin,
                    (object)(item.WinLoss - item.Juice),
                    item.Turnover > 0 ? (object)((item.WinLoss - item.Juice) / item.Turnover * 100) : ViewLang.NA,
                    item.WinLoss,
                    (object)item.Margin ?? ViewLang.NA,
                    item.BetCount,
                    (object)item.Score ?? ViewLang.NA
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
                totalTO,
                totalJuice,
                totalTO > 0 ? (object)(totalJuice / totalTO * 100) : ViewLang.NA,                
                totalWL - totalJuice,
                totalTO > 0 ? (object)((totalWL - totalJuice) / totalTO * 100) : ViewLang.NA,
                totalWL,
                totalTO > 0 ? (object)(totalWL / totalTO * 100) : ViewLang.NA,
                totalBetcount,
                string.Empty
            };
            writer.WriteRow(7, totalRecord);
        }

        [SuppressMessage("StyleCop.CSharp.Nexcel.NexcelCustomRules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(GetTraderPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
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

        #endregion
    }
}