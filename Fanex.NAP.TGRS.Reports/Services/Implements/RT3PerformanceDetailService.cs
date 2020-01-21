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
        private const string RT3ModelPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.RT3PerformanceDetail.ModelPerformance";
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
                                ViewLang.BetTypeExcelFile,
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
                                ViewLang.Month,
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

        public ModelPerformanceList GetModelPerformance(GetModelPerformanceCriteria criteria)
        {
            var modelPerformanceList = new ModelPerformanceList();
            var totalLeagueMatchData = GenerateSampleTotalLeagueMatch();
            var totalPerformanceData = GenerateSampleTotalPerformance();
            var modelData = GenerateSampleModelInfoPerformance();

            modelPerformanceList.AddLeagueMacthTotal(totalLeagueMatchData);
            modelPerformanceList.AddGrandTotal(totalPerformanceData);
            if (modelData != null && modelData.Any())
            {
                if (criteria.DataType == ViewLang.Percentage)
                {
                    modelPerformanceList.AddModelPercentageList(modelData);
                }
                else
                {
                    modelPerformanceList.AddModelList(modelData);
                }                
            }
            SessionManager.Set<ModelPerformanceList>(RT3ModelPerformanceSessionKey, modelPerformanceList);

            return modelPerformanceList;
        }

        public void ExportModelPerformance(int userId, GetModelPerformanceCriteria criteria, string templatePath)
        {
            var modelData = SessionManager.Get<ModelPerformanceList>(RT3ModelPerformanceSessionKey);
            if (modelData != null && modelData.ItemList.Any())
            {
                string reportName = string.Format(
                        ViewLang.RT3PerformanceDetailFileName,
                        ViewLang.Model,
                        criteria.FromDate.ToShortFormatedDateForFileName(),
                        criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.RT3PerformanceDetail);
                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                if (criteria.DataType == ViewLang.Number)
                {
                    writer.CopyRows(3, 2);
                }
                else
                {
                    FillHeader(ref writer);
                }                
                writer.FreezeRow(0, 4);
                FillRowDataModel(modelData, ref writer, criteria.DataType);
                writer.SyncColumnsWidth(17);
                writer.Render();
            }
        }       
        
        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan", Justification = "Need to review here.")]
        private void FilterBlock(int userId, ICriteria rt3criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(11, 0);
            IFont normalFont = writer.GetFont(12, 0);
            int lineCount = 0;

            if (rt3criteria is GetModelPerformanceCriteria)
            {
                var criteria = rt3criteria as GetModelPerformanceCriteria;
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.DataType, boldFont, criteria.DataType, normalFont, "\n");
            }
            else
            {
                var criteria = rt3criteria as RT3PerformanceCriteria;
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
                AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, GetLeagueGroupNames(criteria.LeagueGroupIds), normalFont, "\n");
            }

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            var rowGroupHeader = writer.CopyRows(3, 1);
            rowGroupHeader.GetCell(1).SetCellValue(ViewLang.Match + " %");
            rowGroupHeader.GetCell(2).SetCellValue(ViewLang.BetCount + " %");

            var rowHeader = writer.CopyRows(4, 1);
            rowHeader.GetCell(3).SetCellValue(ViewLang.Turnover + " %");
            rowHeader.GetCell(4).SetCellValue(ViewLang.WinLoss + " %");
            rowHeader.GetCell(5).SetCellValue(ViewLang.Margin);
            rowHeader.GetCell(6).SetCellValue(ViewLang.Turnover + " %");
            rowHeader.GetCell(7).SetCellValue(ViewLang.WinLoss + " %");
            rowHeader.GetCell(8).SetCellValue(ViewLang.Margin);
            rowHeader.GetCell(9).SetCellValue(ViewLang.Turnover + " %");
            rowHeader.GetCell(10).SetCellValue(ViewLang.WinLoss + " %");
            rowHeader.GetCell(11).SetCellValue(ViewLang.Margin);
            rowHeader.GetCell(12).SetCellValue(ViewLang.Turnover + " %");
            rowHeader.GetCell(13).SetCellValue(ViewLang.WinLoss + " %");
            rowHeader.GetCell(14).SetCellValue(ViewLang.Margin);
            rowHeader.GetCell(15).SetCellValue(ViewLang.Turnover + " %");
            rowHeader.GetCell(16).SetCellValue(ViewLang.WinLoss + " %");
            rowHeader.GetCell(17).SetCellValue(ViewLang.Margin);
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

        private void FillRowDataModel(ModelPerformanceList data, ref ExcelTemplateWriter writer, string dataType)
        {
            var index = 1;
            foreach (var item in data.ItemList)
            {
                int styleIndex = index % 2 == 0 ? 6 : 5;
                var record = new object[]
                {
                    item.Model,
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
            if (dataType == ViewLang.Number)
            {
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
            } else
            {
                var totalRecord = new object[]
                {
                    ViewLang.GrandTotal,
                    null,
                    null,
                    null,
                    null,
                    (object)total.VirtualTotalMargin ?? ViewLang.NA,
                    null,
                    null,
                    (object)total.VarianceMargin ?? ViewLang.NA,
                    null,
                    null,
                    (object)total.RealTotalMargin ?? ViewLang.NA,
                    null,
                    null,
                    (object)total.Total8RMMargin ?? ViewLang.NA,
                    null,
                    null,
                    (object)total.Total8RMWLMargin ?? ViewLang.NA
                };
                writer.WriteRow(7, totalRecord);
            }            
        }

        private string GetLeagueGroupNames(string leagueGroupIds)
        {
            var leagueGroups = SessionManager.Get<Dictionary<int, string>>(RT3LeagueGroupsSessionKey);
            var leagueGroupIdList = Array.ConvertAll(leagueGroupIds.Split(','), s => Int16.Parse(s)).ToList();           
            var leagueGroupNames = leagueGroups.Join(leagueGroupIdList, a => a.Key, b => b, (a, b) => a.Value);

            return string.Join(",", leagueGroupNames);
        }        

        public TotalLeagueMatchInfo GenerateSampleTotalLeagueMatch()
            => new TotalLeagueMatchInfo
            {
                LeagueCount = 1722,
                MatchCount = 1813
            };

        public TotalPerformanceInfo GenerateSampleTotalPerformance()
            => new TotalPerformanceInfo
            {
                Total_WinLoss_VR =  new decimal(24461395),
                Total_Stake_VR = new decimal(7048399),
                Total_Margin_VR = new decimal(2.9),
                Total_Winloss_VAR = new decimal(208467095),
                Total_Stake_VAR = new decimal(55047175),
                Total_Margin_VAR = new decimal(2.63),
                Total_Winloss_AR = new decimal(208467095),
                Total_Stake_AR = new decimal(6209557407),
                Total_Margin_AR = new decimal(2.65),
                Total_Winloss_8RM = new decimal(208467095),
                Total_Stake_8RM = new decimal(6209557407),
                Total_Margin_8RM = new decimal(0.03),
                Total_Winloss_AR8RM = new decimal(208467095),
                Total_Stake_AR8RM = new decimal(6209557407),
                Total_Margin_AR8RM = new decimal(0.03)
            };

        public List<ModelPerformanceInfo> GenerateSampleModelInfoPerformance()
        {
            var modelInfos = new List<ModelPerformanceInfo>();
            modelInfos.Add(new ModelPerformanceInfo
            {
                ModelName = RT3PerformanceModel.RT3WithTrader,
                Model = ViewLang.RT3WithTraderPerformance,
                Match = 15620,
                BetCount = 12001,
                WinLoss_VR = 1353747,
                Stake_VR = 593749,
                Margin_VR = new decimal(2.28),
                Winloss_VAR = 22910820,
                Stake_VAR = 10048605,
                Margin_VAR = new decimal(2.28),
                Winloss_AR = 24264567,
                Stake_AR = 1064235395,
                Margin_AR = new decimal(2.28),
                Winloss_8RM = 24264567,
                Stake_8RM = 1064235395,
                Margin_8RM = new decimal(2.28),
                Winloss_AR8RM = 24264567,
                Stake_AR8RM = 1064235395,
                Margin_AR8RM = new decimal(2.28)
            });
            modelInfos.Add(new ModelPerformanceInfo
            {
                ModelName = RT3PerformanceModel.RT3NoTrader,
                Model = ViewLang.RT3NoTraderPerformance,
                Match = 16708,
                BetCount = 300,
                WinLoss_VR = 11553824,
                Stake_VR = 3227325,
                Margin_VR = new decimal(3.58),
                Winloss_VAR = 80547440,
                Stake_VAR = 22499285,
                Margin_VAR = new decimal(3.58),
                Winloss_AR = 92101264,
                Stake_AR = 2572661006,
                Margin_AR = new decimal(3.58),
                Winloss_8RM = 92101264,
                Stake_8RM = 2572661006,
                Margin_8RM = new decimal(3.58),
                Winloss_AR8RM = 92101264,
                Stake_AR8RM = 2572661006,
                Margin_AR8RM = new decimal(3.58)
            });
            modelInfos.Add(new ModelPerformanceInfo
            {
                ModelName = RT3PerformanceModel.TradingAutomation,
                Model = ViewLang.TradingAutomation,
                Match = 16708,
                BetCount = 500,
                WinLoss_VR = 11553824,
                Stake_VR = 3227325,
                Margin_VR = new decimal(3.58),
                Winloss_VAR = 80547440,
                Stake_VAR = 22499285,
                Margin_VAR = new decimal(3.58),
                Winloss_AR = 92101264,
                Stake_AR = 2572661006,
                Margin_AR = new decimal(3.58),
                Winloss_8RM = 92101264,
                Stake_8RM = 2572661006,
                Margin_8RM = new decimal(3.58),
                Winloss_AR8RM = 92101264,
                Stake_AR8RM = 2572661006,
                Margin_AR8RM = new decimal(3.58)
            });

            return modelInfos;
        }

    }
}