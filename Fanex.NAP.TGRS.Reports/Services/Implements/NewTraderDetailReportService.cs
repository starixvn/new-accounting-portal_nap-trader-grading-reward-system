namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Models.NewPerformanceDetail;
    using System.Collections.Generic;

    public partial class NewDetailReportService : TGRSBaseService, INewDetailReportService
    {
        private const string TraderPerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.Reports.NewTraderPerformance";

        public IEnumerable<TraderPerformanceInfo> GetTraderPerformance(ICriteria criteria)
        {
            return this.GetData<TraderPerformanceInfo>(criteria);
        }

        public IEnumerable<MatchPerformanceInfo> GetTraderMatchPerformance(ICriteria criteria)
        {
            return this.GetData<MatchPerformanceInfo>(criteria);
        }

        public IEnumerable<BetTypePerformanceInfo> GetTraderMatchBettypePerformance(ICriteria criteria)
        {
            return this.GetData<BetTypePerformanceInfo>(criteria);
        }
        /*
        public TraderPerformanceList GetTraderPerformance(ICriteria criteria)
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
                SessionManager.Set<TraderPerformanceList>(TraderPerformanceDetailReportSessionKey, traderPerformance);
            }

            return traderPerformance;
        }

        public MatchPerformanceList GetMatchPerformanceOfTrader(ICriteria criteria)
        {
            IEnumerable<MatchPerformanceInfo> matchData = this.GetData<MatchPerformanceInfo>(criteria);
            MatchPerformanceList matchPerformance = new MatchPerformanceList();

            IEnumerable<IGrouping<int?, MatchPerformanceInfo>> leagueGroups = matchData.GroupBy(obj => obj.LeagueId);
            MatchPerformanceGroup leagueGroup = null;

            foreach (IGrouping<int?, MatchPerformanceInfo> group in leagueGroups)
            {
                if (group.Key.HasValue)
                {
                    leagueGroup = new MatchPerformanceGroup(group.Key);

                    foreach (MatchPerformanceInfo match in group)
                    {
                        leagueGroup.AddItem(new MatchPerformanceItem(match));
                    }

                    leagueGroup.Total.Margin = CalculateTotalMargin(leagueGroup.Total.WinLoss, leagueGroup.Total.Turnover);
                    matchPerformance.AddItem(leagueGroup);
                }
            }

            matchPerformance.GroupList = matchPerformance.GroupList.OrderBy(obj => obj.LeagueName).ToList();
            matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
            matchPerformance.TotalItems = matchData.Count();
            return matchPerformance;
        }

        public IEnumerable<BetTypeDetailItem> GetBettypeDetailTrader(GetBettypeDetailTrader criteria)
        {
            GetScoreByPeriodCriteria scoreByPeriodCriteria = new GetScoreByPeriodCriteria
            {
                FromDate = criteria.FromDate,
                ToDate = criteria.ToDate,
                CustId = criteria.CustId,
                MatchId = criteria.MatchId,
            };

            var bettypeData = this.GetData<BetTypeDetailInfo>(criteria);
            var bettypeDetail = new List<BetTypeDetailItem>();

            if (bettypeData != null && bettypeData.Any())
            {
                foreach (var item in bettypeData)
                {
                    var bettypeItem = new BetTypeDetailItem(item);

                    bettypeDetail.Add(bettypeItem);
                }
            }

            return bettypeDetail;
        }

        public void ExportTraderPerformance(GetTraderPerformanceCriteria criteria, string templatePath)
        {
            TraderPerformanceList traderData = SessionManager.Get<TraderPerformanceList>(TraderPerformanceDetailReportSessionKey);

            if ((traderData != null) && (traderData.ItemList.Count > 0))
            {
                string reportName = string.Format(
                                ViewLang.PerformanceDetailFileName,
                                ViewLang.Trader,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());

                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.TraderPerformance);
                writer.CopyRows(0, 1);
                FilterBlock(criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 3);
                FillRowData(traderData, ref writer);
                writer.SyncColumnsWidth(10);
                writer.Render();
            }
        }

        private void FillRowData(TraderPerformanceList contentData, ref ExcelTemplateWriter writer)
        {
            // Content rows
            int len = contentData.ItemList.Count;
            TraderPerformanceItem item;

            for (int i = 0; i < len; i++)
            {
                int styleIndex = (i % 2 == 0) ? 4 : 5;
                item = contentData.ItemList[i];

                var record = new object[]
                {
                    i + 1,
                    item.TraderName,
                    item.Grade,
                    item.TeamName,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.Turnover,
                    item.WinLoss,
                    item.BetCount,
                    (object)item.Margin ?? ViewLang.NA,
                    (object)item.Score ?? ViewLang.NA
                };
                writer.WriteRow(styleIndex, record);
            }

            // Total row
            TraderPerformanceItem total = contentData.Total;
            var totalRecord = new object[]
            {
                ViewLang.GrandTotal,
                null,
                null,
                null,
                total.NoOfLeagues,
                total.NoOfMatches,
                total.Turnover,
                total.WinLoss,
                total.BetCount,
                (object)total.Margin ?? ViewLang.NA,
                string.Empty
            };
            writer.WriteRow(6, totalRecord);
        }

        [SuppressMessage("StyleCop.CSharp.Nexcel.NexcelCustomRules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(GetTraderPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(10, 0);
            IFont normalFont = writer.GetFont(11, 0);
            int lineCount = 0;

            List<BetTypeItem> betTypes = this.GetBetTypes().ToList();
            string betTypeString = MakeBetTypeSelectString(betTypes, criteria.BetTypes);
            string turnoverString = (criteria.Turnover != null) ? criteria.Turnover.Format(2) : string.Empty;
            string winlostString = (criteria.WinLoss != null) ? criteria.WinLoss.Format(2) : string.Empty;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, betTypeString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumTurnover, boldFont, turnoverString, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MinimumWinLoss, boldFont, winlostString, normalFont, "\n");

            //// Margin
            string marginFromString = MinPercentString;
            string marginToString = MaxPercentString;
            if (criteria.MarginFrom != null)
            {
                marginFromString = criteria.MarginFrom.ToString();
            }

            if (criteria.MarginTo != null)
            {
                marginToString = criteria.MarginTo.ToString();
            }

            if (criteria.MarginFrom != null || criteria.MarginTo != null)
            {
                string marginString;
                if (criteria.MarginFrom == null)
                {
                    marginString = string.Format("≤ {0}", criteria.MarginTo);
                }
                else if (criteria.MarginTo == null)
                {
                    marginString = string.Format("≥ {0}", criteria.MarginFrom);
                }
                else
                {
                    marginString = string.Format("from {0} to {1}", marginFromString, marginToString);
                }

                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Margin, boldFont, marginString, normalFont, "\n");
            }

            //// Trader
            string userNameString = (criteria.Username != null) ? string.Format("contains '{0}'", criteria.Username) : string.Empty;
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Trader, boldFont, userNameString, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(7, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }
        */
    }
}