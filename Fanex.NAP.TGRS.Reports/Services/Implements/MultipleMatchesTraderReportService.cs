namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data.Repository;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    
    public partial class MultipleMatchesTraderReportService : TGRSBaseService, IMultipleMatchesReportService
    {
        private const string MultipleMatchesTraderPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.TraderPerformance";
        private const int PointInPixel = 225;

        public TraderPerformanceList GetTraderPerformance(ICriteria criteria)
        {
            var traderPerformance = new TraderPerformanceList();
            //var rawData = this.GetData<TraderPerformanceInfo>(criteria);
            var rawData = GenerateSampleTraderPerformance();

            if (rawData != null && rawData.Any())
            {
                var traderData = SortTraderPerformanceInfo(rawData);
                traderPerformance.AddTraderList(traderData);
                traderPerformance.Total.Margin = CalculateTotalMargin(traderPerformance.Total.WinLoss, traderPerformance.Total.Turnover);
                SessionManager.Set<TraderPerformanceList>(MultipleMatchesTraderPerformanceSessionKey, traderPerformance);
            }

            return traderPerformance;
        }

        private IEnumerable<TraderPerformanceInfo> SortTraderPerformanceInfo(IEnumerable<TraderPerformanceInfo> traderData)
        {
            return traderData.AsEnumerable()
                            .OrderBy(c => c.CustId)
                            .Select(c => new TraderPerformanceInfo
                            {
                                CustId = c.CustId,
                                MatchCount = c.MatchCount,
                                MultipleTimes = c.MultipleTimes,
                                FrequencyCust = traderData.Count(b => b.CustId == c.CustId)
                            });
        }       

        public MatchPerformanceList GetMatchPerformanceOfTrader(ICriteria criteria)
        {
            //var matchData = this.GetData<MatchPerformanceInfo>(criteria);
            var matchData = GenerateSampleMatchPerformance();

            var matchPerformance = new MatchPerformanceList();
            var matchGroups = matchData.GroupBy(obj => obj.MatchGroupKey);
            MatchPerformanceGroup matchGroup = null;

            foreach (IGrouping<string, MatchPerformanceInfo> group in matchGroups)
            {
                if (!string.IsNullOrEmpty(group.Key))
                {
                    matchGroup = new MatchPerformanceGroup(group.Key);
                    matchGroup.AddMatchList(group);
                    matchGroup.Total.Margin = CalculateTotalMargin(matchGroup.Total.WinLoss, matchGroup.Total.Turnover);
                    matchPerformance.AddItem(matchGroup);
                }
            }
            matchPerformance.GroupList = matchPerformance.GroupList.ToList();
            matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
            matchPerformance.TotalItems = matchData.Count();

            return matchPerformance;
        }

        public BetTypeList GetBettypeTrader(ICriteria criteria)
        {
            var betTypes = new BetTypeList();
            //var bettypeData = this.GetData<BetTypeInfo>(criteria);
            var bettypeData = GenerateSampleGetBettypeTrader();
            if (bettypeData != null && bettypeData.Any())
            {
                betTypes.AddBettypeList(bettypeData);
                betTypes.Total.Margin = CalculateTotalMargin(betTypes.Total.WinLoss, betTypes.Total.Turnover);
            }

            return betTypes;
        }

        private decimal? CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            decimal? margin = null;

            if (turnover != 0)
            {
                margin = winLoss / turnover * 100;
            }

            return margin;
        }

        public void ExportTraderPerformance(int userId, GetTraderPerformanceCriteria criteria, string templatePath)
        {
            var traderData = SessionManager.Get<TraderPerformanceList>(MultipleMatchesTraderPerformanceSessionKey);
            if (traderData != null && traderData.ItemList.Count > 0)
            {
                string reportName = string.Format(
                                ViewLang.MultipleMatchesPerformanceTraderFileName,
                                ViewLang.Trader,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.TraderPerformance);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 3);
                FillRowData(traderData, ref writer);
                writer.SyncColumnsWidth(10);

                writer.Render();
            }
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 1);
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userId, GetTraderPerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(10, 0);
            IFont normalFont = writer.GetFont(11, 0);
            int lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            //AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, betTypeString, normalFont, "\n");

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

        private void FillRowData(TraderPerformanceList data, ref ExcelTemplateWriter writer)
        {
            // Content rows
            TraderPerformanceItem item;
            var contentData = data.ItemList;
            int len = contentData.Count;            
            var leagueCounter = 1;
            for (int i = 0; i < len; i++)
            {
                item = contentData[i];
                int styleIndex = leagueCounter % 2 == 0 ? 4 : 5;
                var record = new object[]
                {
                    i + 1,
                    item.TraderName,
                    item.Grade,
                    item.TeamName,
                    item.NoOfTimes,
                    item.NoOfMatches,
                    item.Turnover,
                    item.WinLoss,
                    item.BetCount,
                    (object)item.Margin ?? ViewLang.NA,
                };

                writer.WriteRow(styleIndex, record);
            }

            var total = data.Total;
            var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    total.NoOfMatches,
                    total.Turnover,                    
                    total.WinLoss,
                    total.BetCount,
                    (object)total.Margin ?? ViewLang.NA
                };
            writer.WriteRow(6, totalRecord);
        }

        #region Sample data
        private IEnumerable<TraderPerformanceInfo> GenerateSampleTraderPerformance()
        {
            var traderPerformances = new List<TraderPerformanceInfo>();
            for (int i = 1; i < 10; i++)
            {
                traderPerformances.Add(new TraderPerformanceInfo()
                {
                    CustId = i,
                    MatchCount = 1,
                    MultipleTimes = 1,
                    FrequencyCust = 2
                });
                traderPerformances.Add(new TraderPerformanceInfo()
                {
                    CustId = i,
                    MatchCount = 1,
                    MultipleTimes = 1,
                    FrequencyCust = 2
                });
            }

            return traderPerformances;
        }

        private IEnumerable<MatchPerformanceInfo> GenerateSampleMatchPerformance()
        {
            var matchData = new List<MatchPerformanceInfo>();
            var fromDate = new System.DateTime(2019, 10, 20);            

            for (int i = 1; i < 52; i++)
            {
                var percent = i % 30;
                var toDate = new System.DateTime(2019, 10, percent == 0 ? 1 : percent);

                matchData.Add(new MatchPerformanceInfo
                {
                    MatchGroupKey = i.ToString(),
                    AwayId = 370154,
                    HomeId = 614358,
                    BetCount = 1,
                    EventDate = fromDate,
                    FromDate = fromDate,
                    ToDate = toDate,
                    Margin = 1,
                    MatchId = i,
                    Turnover = 1,
                    WinLoss = 1
                });
                matchData.Add(new MatchPerformanceInfo
                {
                    MatchGroupKey = i.ToString(),
                    AwayId = 6574,
                    HomeId = 6262,
                    BetCount = 1,
                    EventDate = fromDate,
                    FromDate = fromDate,
                    ToDate = toDate,
                    Margin = 1,
                    MatchId = i,
                    Turnover = 1,
                    WinLoss = 1
                });
                matchData.Add(new MatchPerformanceInfo
                {
                    MatchGroupKey = i.ToString(),
                    AwayId = 368485,
                    HomeId = 368476,
                    BetCount = 1,
                    EventDate = fromDate,
                    FromDate = fromDate,
                    ToDate = toDate,
                    Margin = 1,
                    MatchId = i,
                    Turnover = 1,
                    WinLoss = 1
                });
            }

            return matchData;
        }

        private IEnumerable<BetTypeInfo> GenerateSampleGetBettypeTrader()
        {
            var bettypes = new List<BetTypeInfo>();
            bettypes.Add(new BetTypeInfo
            {
                BetType = 1,
                TypeName = "HDP",
                Turnover = new decimal(4090520.95),
                WinLoss = new decimal(84531.38),
                BetCount = 10,
                Margin = new decimal(2.07)
            });

            bettypes.Add(new BetTypeInfo
            {
                BetType = 1,
                TypeName = "1st HDP",
                Turnover = new decimal(2870947.97),
                WinLoss = new decimal(3781126),
                BetCount = 14,
                Margin = new decimal(1.32)
            });

            return bettypes;
        }
        #endregion
    }
}