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
     
        public IEnumerable<TeamItem> GetTeams()
        {
            var criteria = new GetTeamsCriteria();
            var teamData = this.GetData<TeamInfo>(criteria);
            IEnumerable<TeamItem> teams = new List<TeamItem>();

            if (teamData.Any())
            {
                teams = teamData.Select(obj => new TeamItem(obj));
            }

            return teams;
        }

        public TraderPerformanceList GetTraderPerformance(ICriteria criteria)
        {
            var traderPerformance = new TraderPerformanceList();
            var traderData = this.GetData<TraderPerformanceInfo>(criteria);
            if (traderData != null && traderData.Any())
            {
                var traderGroups = traderData.GroupBy(obj => obj.CustId);
                TraderPerformanceGroup traderGroup = null;

                foreach (IGrouping<int, TraderPerformanceInfo> group in traderGroups)
                {
                    traderGroup = new TraderPerformanceGroup(group.Key);
                    traderGroup.AddHeader(group);
                    traderGroup.AddTraderList(group);
                    traderGroup.Total.Margin = CalculateTotalMargin(traderGroup.Total.WinLoss, traderGroup.Total.Turnover);
                    traderPerformance.AddItem(traderGroup);
                }
                traderPerformance.GroupList = traderPerformance.GroupList.ToList();
                traderPerformance.GrandTotal.Margin = CalculateTotalMargin(traderPerformance.GrandTotal.WinLoss, traderPerformance.GrandTotal.Turnover);
                traderPerformance.TotalItems = traderData.Count();
                SessionManager.Set<TraderPerformanceList>(MultipleMatchesTraderPerformanceSessionKey, traderPerformance);
            }            

            return traderPerformance;
        }

        public MatchPerformanceList GetMatchPerformanceOfTrader(ICriteria criteria)
        {
            var matchPerformance = new MatchPerformanceList();
            var matchData = this.GetData<MatchPerformanceInfo>(criteria);            
            var matchGroups = matchData.GroupBy(obj => obj.MatchGroup);
            MatchPerformanceGroup matchGroup = null;

            foreach (IGrouping<int, MatchPerformanceInfo> group in matchGroups)
            {
                if (group.Key > 0)
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
            if (traderData != null && traderData.TotalItems > 0)
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
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Grade, boldFont, criteria.GradeIds, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Team, boldFont, criteria.TeamIds, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, criteria.Bettypes, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MultipleMatches, boldFont, criteria.MultipleMatches, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(7, contentRichTextArray);
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
            var index = 1;
            foreach (var group in data.GroupList)
            {
                foreach (var item in group.ItemList)
                {
                    int styleIndex = index % 2 == 0 ? 4 : 5;
                    var record = new object[]
                    {
                        index,
                        group.TraderName,
                        group.Grade,
                        group.TeamName,
                        item.MultipleMatches,
                        item.NoOfMatches,
                        item.Turnover,
                        item.WinLoss,
                        item.BetCount,
                        (object)item.Margin ?? ViewLang.NA,
                    };
                    
                    writer.WriteRow(styleIndex, record);
                }
                index++;
            }           

            var total = data.GrandTotal;
            var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    null,
                    null,
                    null,
                    null,
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
                    MultipleMatches = 5,
                    MultipleTimes = 3                    
                });
                traderPerformances.Add(new TraderPerformanceInfo()
                {
                    CustId = i,
                    MultipleMatches = 4,
                    MultipleTimes = 3                   
                });
            }

            return traderPerformances;
        }

        private IEnumerable<MatchPerformanceInfo> GenerateSampleMatchPerformance()
        {
            var matchData = new List<MatchPerformanceInfo>();
            var fromDate = new System.DateTime(2019, 10, 20);            

            for (int i = 1; i < 18; i++)
            {
                var percent = i % 30;
                var toDate = new System.DateTime(2019, 10, percent == 0 ? 1 : percent);

                matchData.Add(new MatchPerformanceInfo
                {
                    MatchGroup = i,
                    AwayId = 1397,
                    HomeId = 24432,
                    BetCount = 1,
                    EventDate = fromDate,
                    GlobalShowTime = toDate,
                    Margin = 1,
                    MatchId = i,
                    Turnover = 1,
                    WinLoss = 1
                });
                matchData.Add(new MatchPerformanceInfo
                {
                    MatchGroup = i,
                    AwayId = 6574,
                    HomeId = 6262,
                    BetCount = 1,
                    EventDate = fromDate,                    
                    GlobalShowTime = toDate,
                    Margin = 1,
                    MatchId = i,
                    Turnover = 1,
                    WinLoss = 1
                });
                matchData.Add(new MatchPerformanceInfo
                {
                    MatchGroup = i,
                    AwayId = 22611,
                    HomeId = 1667,
                    BetCount = 1,
                    EventDate = fromDate,                    
                    GlobalShowTime = toDate,
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