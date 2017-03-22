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
    using System.Linq;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string BetTypePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewBetTypePerformance";

        public IEnumerable<BetTypePerformanceInfo> GetBetTypePerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypePerformanceInfo>(criteria);

            result = result ?? new List<BetTypePerformanceInfo>();

            SessionManager.Set<IEnumerable<BetTypePerformanceInfo>>(BetTypePerformanceDetailReportSessionKey, result);

            return result;
        }

        public IEnumerable<BetTypeLeaguePerformanceInfo> GetBetTypeLeaguePerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypeLeaguePerformanceInfo>(criteria);

            result = result ?? new List<BetTypeLeaguePerformanceInfo>();

            return result;
        }

        public IEnumerable<BetTypeLeagueTraderPerformanceInfo> GetBetTypeLeagueTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypeLeagueTraderPerformanceInfo>(criteria);

            result = result ?? new List<BetTypeLeagueTraderPerformanceInfo>();

            if (!(criteria as GetTraderPerformanceOfBetTypeLeagueCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            return result;
        }

        public IEnumerable<BetTypeLeagueTraderMatchPerformanceInfo> GetBetTypeLeagueTraderMatchPerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypeLeagueTraderMatchPerformanceInfo>(criteria);

            result = result ?? new List<BetTypeLeagueTraderMatchPerformanceInfo>();

            if (!(criteria as GetMatchPerformanceOfBetTypeLeagueTraderCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            return result;
        }

        public IEnumerable<BetTypeTraderPerformanceInfo> GetBetTypeTraderPerformance(ICriteria criteria)
        {
            var result = this.GetData<BetTypeTraderPerformanceInfo>(criteria);

            result = result ?? new List<BetTypeTraderPerformanceInfo>();

            if (!(criteria as GetTraderPerformanceOfBetTypeCriteria).IsViewScore)
            {
                foreach (var item in result)
                {
                    item.Score = null;
                }
            }

            return result;
        }

        public Dictionary<string, IEnumerable<BetTypeTraderMatchPerformanceInfo>> GetBetTypeTraderMatchPerformance(ICriteria criteria)
        {
            var data = this.GetData<BetTypeTraderMatchPerformanceInfo>(criteria);
            var result = new Dictionary<string, IEnumerable<BetTypeTraderMatchPerformanceInfo>>();

            data = data ?? new List<BetTypeTraderMatchPerformanceInfo>();

            if (!(criteria as GetMatchPerformanceOfBetTypeTraderCriteria).IsViewScore)
            {
                foreach (var item in data)
                {
                    item.Score = null;
                }
            }

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

        public void ExportBetTypePerformance(GetBetTypePerformanceCriteria criteria, string templatePath)
        {
            var bettypeData = SessionManager.Get<IEnumerable<BetTypePerformanceInfo>>(BetTypePerformanceDetailReportSessionKey);
            if (bettypeData == null || (bettypeData != null && bettypeData.Count() == 0))
            {
                bettypeData = this.GetData<BetTypePerformanceInfo>(criteria);

                bettypeData = bettypeData ?? new List<BetTypePerformanceInfo>();

                SessionManager.Set<IEnumerable<BetTypePerformanceInfo>>(BetTypePerformanceDetailReportSessionKey, bettypeData);
            }

            if ((bettypeData != null) && (bettypeData.Count() > 0))
            {
                string reportName = string.Format(
                                    ViewLang.NewPerformanceDetailFileName,
                                    ViewLang.BetTypeExcelFile,
                                    criteria.FromDate.ToShortFormatedDateForFileName(),
                                    criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.NewBetTypePerformance);

                writer.CopyRows(0, 1);

                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowData(bettypeData, ref writer);
                writer.SyncColumnsWidth(13);
                writer.Render();
            }
        }

        #region Private

        private void FillRowData(IEnumerable<BetTypePerformanceInfo> contentData, ref ExcelTemplateWriter writer)
        {
            decimal totalTO = 0, totalTOJuice = 0, totalTOLeftover = 0, totalJuice = 0, totalLeftover = 0, totalWL = 0;
            int totalTrader = 0, totalMatch = 0, totalBetcount = 0, totalLeague = 0, len = contentData.Count();

            for (int i = 0; i < len; i++)
            {
                int styleIndex = (i % 2 == 0) ? 5 : 6;
                var item = contentData.ElementAt(i);

                var record = new object[]
                {
                    i + 1, item.TypeName, item.TraderCount, item.LeagueCount, item.MatchCount,
                    item.Juice,
                    item.TurnoverJuice,
                    (object)item.JuiceMargin ?? ViewLang.NA,
                    (object)item.JuiceMarginTotal ?? ViewLang.NA,
                    item.WinlostLeftover,
                    item.TurnoverLeftover,
                    (object)item.LeftoverMargin ?? ViewLang.NA,
                    (object)item.LeftoverMarginTotal ?? ViewLang.NA,
                    item.WinLoss,
                    item.Turnover,
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
                totalJuice,
                totalTOJuice,
                totalTOJuice > 0 ? (object)(totalJuice / totalTOJuice * 100) : ViewLang.NA,
                totalTO > 0 ? (object)(totalJuice / totalTO * 100) : ViewLang.NA,
                totalLeftover,
                totalTOLeftover,
                totalTOLeftover > 0 ? (object)(totalLeftover / totalTOLeftover * 100) : ViewLang.NA,
                totalTO > 0 ? (object)(totalLeftover / totalTO * 100) : ViewLang.NA,
                totalWL,
                totalTO,
                totalTO > 0 ? (object)(totalWL / totalTO * 100) : ViewLang.NA,
                totalBetcount
            };
            writer.WriteRow(7, totalRecord);
        }

        private void FilterBlock(GetBetTypePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
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