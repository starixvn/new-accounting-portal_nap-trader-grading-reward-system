namespace Fanex.NAP.TGRS.Reports.Services
{
    using Fanex.Data;
    using Fanex.Data.Repository;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.Reports.Criteria.RT3PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.RT3PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.ViewModels.RT3PerformanceDetail;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;

    public class RT3PerformanceDetailService : TGRSBaseService, IRT3PerformanceDetailService
    {
        private const string RT3LeagueGroupsSessionKey = "Fanex.NAP.TGRS.Reports.RT3PerformanceDetail.LeagueGroups";
        private const string RT3BetTypePerformanceSessionKey = "Fanex.NAP.TGRS.Reports.RT3PerformanceDetail.BetTypePerformance";
        private const string RT3MonthPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.RT3PerformanceDetail.MonthPerformance";
        private const int PointInPixel = 225;

        public Dictionary<int, string> GetLeagueGroups()
        {
            var leagueGroups = new Dictionary<int, string>();
            leagueGroups.Add(1, "MJ");
            leagueGroups.Add(2, "M1");
            leagueGroups.Add(3, "M2");
            leagueGroups.Add(4, "M3");
            leagueGroups.Add(5, "M4");
            leagueGroups.Add(6, "Others");
            SessionManager.Set<Dictionary<int, string>>(RT3LeagueGroupsSessionKey, leagueGroups);

            return leagueGroups;
        }

        public BetTypePerformanceList GetBetTypePerformance(ICriteria criteria)
        {
            var betTypePerformance = new BetTypePerformanceList();
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()) )
            {
                using (var multi = objectDb.QueryMultiple(criteria))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var totalPerformanceData = multi.Read<TotalPerformanceInfo>();
                    var betTypeData = multi.Read<BetTypePerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        betTypePerformance.AddLeagueMacthTotal(totalLeagueMatchData.ToList()[0]);
                    }
                    
                    if (totalPerformanceData != null && totalPerformanceData.Any())
                    {
                        betTypePerformance.AddGrandTotal(totalPerformanceData.ToList()[0]);
                    }
                    
                    if (betTypeData != null && betTypeData.Any())
                    {
                        betTypePerformance.AddBetTypeList(betTypeData);
                    }
                    SessionManager.Set<BetTypePerformanceList>(RT3BetTypePerformanceSessionKey, betTypePerformance);
                }
            }

            return betTypePerformance;
        }
              
        public void ExportBetTypePerformance(int userId, GetBetTypePerformanceCriteria criteria, string templatePath)
        {
            var betTypeData = SessionManager.Get<BetTypePerformanceList>(RT3BetTypePerformanceSessionKey);
            if (betTypeData != null && betTypeData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.RT3PerformanceDetailFileName,
                                ViewLang.BetType,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.RT3PerformanceDetail);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowDataBetType(betTypeData, ref writer);
                writer.SyncColumnsWidth(16);
                writer.Render();
            }
        }

        public MonthPerformanceList GetMonthPerformance(ICriteria criteria)
        {
            var monthPerformance = new MonthPerformanceList();
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var multi = objectDb.QueryMultiple(criteria))
                {
                    var totalLeagueMatchData = multi.Read<TotalLeagueMatchInfo>();
                    var totalPerformanceData = multi.Read<TotalPerformanceInfo>();
                    var monthData = multi.Read<MonthPerformanceInfo>();

                    if (totalLeagueMatchData != null && totalLeagueMatchData.Any())
                    {
                        monthPerformance.AddLeagueMacthTotal(totalLeagueMatchData.ToList()[0]);
                    }
                    
                    if (totalPerformanceData != null && totalPerformanceData.Any())
                    {
                        monthPerformance.AddGrandTotal(totalPerformanceData.ToList()[0]);
                    }
                    
                    if (monthData != null && monthData.Any())
                    {
                        monthPerformance.AddBetTypeList(monthData);
                    }
                    SessionManager.Set<MonthPerformanceList>(RT3MonthPerformanceSessionKey, monthPerformance);
                }
            }

            return monthPerformance;
        }

        public void ExportMonthPerformance(int userId, GetMonthPerformanceCriteria criteria, string templatePath)
        {            
            var monthData = SessionManager.Get<MonthPerformanceList>(RT3MonthPerformanceSessionKey);
            if (monthData != null && monthData.ItemList.Any())
            {
                string reportName = string.Format(
                                ViewLang.RT3PerformanceDetailFileName,
                                ViewLang.BetType,
                                criteria.FromDate.ToShortFormatedDateForFileName(),
                                criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.RT3PerformanceDetail);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 4);
                FillRowDataMonth(monthData, ref writer);
                writer.SyncColumnsWidth(17);
                writer.Render();
            }
        }

        private decimal CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            if (turnover != 0)
            {
                return winLoss / turnover * 100;
            }

            return 0;
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 2);            
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userId, RT3PerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, GetLeagueGroupNames(criteria.LeagueGroupIds), normalFont, "\n");

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
            int charPerLine = 216; // Number char per line in filter block - use to calculate number of line
            var line = name + value;
            lineCount += Convert.ToInt32(Math.Ceiling((float)line.Length / charPerLine));
        }

        private void FillRowDataBetType(BetTypePerformanceList data, ref ExcelTemplateWriter writer)
        {
            var index = 1;
            foreach (var item in data.ItemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var record = new object[]
                {
                        item.BetTypeName,
                        item.BetCount,
                        item.VirtualTotalTurnover,
                        item.VirtualTotalWinLoss,
                        (object)item.VirtualTotalMargin ?? ViewLang.NA,
                        item.VarianceTurnover,
                        item.VarianceWinLoss,
                        (object)item.VarianceMargin ?? ViewLang.NA,
                        item.RealTotalTurnover,
                        item.RealTotalWinLoss,
                        (object)item.RealTotalMargin ?? ViewLang.NA,
                        item.Total8RMTurnover,
                        item.Total8RMWinLoss,
                        (object)item.Total8RMMargin ?? ViewLang.NA,
                        item.Total8RMWLTurnover,
                        item.Total8RMWLWinLoss,
                        (object)item.Total8RMWLMargin ?? ViewLang.NA
                };

                writer.WriteRow(styleIndex, record);
                index++;
            }

            var total = data.GrandTotal;
            var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    total.BetCount,
                    total.VirtualTotalTurnover,
                    total.VirtualTotalWinLoss,
                    (object)total.VirtualTotalMargin ?? ViewLang.NA,
                    total.VarianceTurnover,
                    total.VarianceWinLoss,
                    (object)total.VarianceMargin ?? ViewLang.NA,
                    total.RealTotalTurnover,
                    total.RealTotalWinLoss,
                    (object)total.RealTotalMargin ?? ViewLang.NA,
                    total.Total8RMTurnover,
                    total.Total8RMWinLoss,
                    (object)total.Total8RMMargin ?? ViewLang.NA,
                    total.Total8RMWLTurnover,
                    total.Total8RMWLWinLoss,
                    (object)total.Total8RMWLMargin ?? ViewLang.NA
                };
            writer.WriteRow(7, totalRecord);
        }

        private void FillRowDataMonth(MonthPerformanceList data, ref ExcelTemplateWriter writer)
        {
            var index = 1;
            foreach (var item in data.ItemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var record = new object[]
                {
                    item.Month,
                    item.Match,
                    item.BetCount,
                    item.VirtualTotalTurnover,
                    item.VirtualTotalWinLoss,
                    (object)item.VirtualTotalMargin ?? ViewLang.NA,
                    item.VarianceTurnover,
                    item.VarianceWinLoss,
                    (object)item.VarianceMargin ?? ViewLang.NA,
                    item.RealTotalTurnover,
                    item.RealTotalWinLoss,
                    (object)item.RealTotalMargin ?? ViewLang.NA,
                    item.Total8RMTurnover,
                    item.Total8RMWinLoss,
                    (object)item.Total8RMMargin ?? ViewLang.NA,
                    item.Total8RMWLTurnover,
                    item.Total8RMWLWinLoss,
                    (object)item.Total8RMWLMargin ?? ViewLang.NA
                };

                writer.WriteRow(styleIndex, record);
                index++;
            }

            var total = data.GrandTotal;
            var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,                    
                    total.Match,
                    total.BetCount,
                    total.VirtualTotalTurnover,
                    total.VirtualTotalWinLoss,
                    (object)total.VirtualTotalMargin ?? ViewLang.NA,
                    total.VarianceTurnover,
                    total.VarianceWinLoss,
                    (object)total.VarianceMargin ?? ViewLang.NA,
                    total.RealTotalTurnover,
                    total.RealTotalWinLoss,
                    (object)total.RealTotalMargin ?? ViewLang.NA,
                    total.Total8RMTurnover,
                    total.Total8RMWinLoss,
                    (object)total.Total8RMMargin ?? ViewLang.NA,
                    total.Total8RMWLTurnover,
                    total.Total8RMWLWinLoss,
                    (object)total.Total8RMWLMargin ?? ViewLang.NA
                };
            writer.WriteRow(7, totalRecord);
        }        

        private string GetLeagueGroupNames(string leagueGroupIds)
        {
            var leagueGroups = SessionManager.Get<Dictionary<int, string>>(RT3LeagueGroupsSessionKey);
            var leagueGroupIdList = Array.ConvertAll(leagueGroupIds.Split(','), s => Int16.Parse(s)).ToList();           
            var leagueGroupNames = leagueGroups.Join(leagueGroupIdList, a => a.Key, b => b, (a, b) => a.Value);

            return string.Join(",", leagueGroupNames);
        }
    }
}