namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Core.Web;
    using Fanex.Data.Repository;
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
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using Criteria.ActualRatePerformanceDetail;

    public partial class ActualRateDetailReportService : TGRSBaseService, IActualRateDetailReportService
    {
        #region Constants
        private const string LeaguePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.ActualRateLeaguePerformance";
        #endregion Constants

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

            if (!(criteria as GetActualRateTraderPerformanceOfLeagueCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            return result;
        }

        public IEnumerable<LeagueTraderMatchPerformanceInfo> GetMatchPerformanceOfLeagueAndTrader(ICriteria criteria)
        {
            var result = this.GetData<LeagueTraderMatchPerformanceInfo>(criteria);

            result = result ?? new List<LeagueTraderMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueMatchPerformanceInfo> GetMatchPerformanceOfLeague(ICriteria criteria)
        {
            var result = this.GetData<LeagueMatchPerformanceInfo>(criteria);

            result = result ?? new List<LeagueMatchPerformanceInfo>();

            return result;
        }

        public IEnumerable<LeagueTraderMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueTraderAndMatch(ICriteria criteria)
        {
            var result = this.GetData<LeagueTraderMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<LeagueTraderMatchBettypePerformanceInfo>();

            if (!(criteria as GetActualRateBettypeDetailLeagueCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            return result;
        }

        public IEnumerable<LeagueMatchBettypePerformanceInfo> GetBettypePerformanceOfLeagueAndMatch(ICriteria criteria)
        {
            var result = this.GetData<LeagueMatchBettypePerformanceInfo>(criteria);

            result = result ?? new List<LeagueMatchBettypePerformanceInfo>();

            if (!(criteria as GetActualRateBetTypePerformanceOfLeagueMatchCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            return result;
        }

        public void ExportLeaguePerformance(GetActualRateLeaguePerformanceCriteria criteria, string templatePath)
        {
            var leagueData = SessionManager.Get<IEnumerable<LeaguePerformanceInfo>>(LeaguePerformanceDetailReportSessionKey);

            if (leagueData != null && leagueData.Count() > 0)
            {
                //sort desc field Margin before export data to excel, because this is set default for javascript display into grid
                leagueData = leagueData.OrderByDescending(c => c.Margin);

                string reportName = string.Format(
                                ViewLang.ActualRatePerformanceDetailFileName,
                                ViewLang.LeagueActualRate,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.NewLeaguePerformance);
                writer.CopyRows(0, 1);

                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowData(leagueData, ref writer);
                //total column in the file is 16
                writer.SyncColumnsWidth(16);
                writer.Render();
            }
        }

        #region Private methods
        private void FilterBlock(GetActualRateLeaguePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
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

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FillRowData(IEnumerable<LeaguePerformanceInfo> data, ref ExcelTemplateWriter writer)
        {
            var len = data.Count();
            decimal totalTO = 0, totalTOJuice = 0, totalTOLeftover = 0, totalJuice = 0, totalLeftover = 0, totalWL = 0;
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
                    item.BetCount
                };
                writer.WriteRow(styleIndex, record);

                totalTO += item.Turnover;
                totalTOJuice += item.TurnoverJuice;
                totalTOLeftover += item.TurnoverLeftover;
                totalLeftover += item.WinlostLeftover;
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
                totalBetcount
            };
            writer.WriteRow(7, totalRecord);
        }
        #endregion Private methods
    }
}
