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
    using Fanex.NAP.TGRS.Reports.Models.Permission;
    using Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    
    public partial class MultipleMatchesTraderReportService : TGRSBaseService, IMultipleMatchesReportService
    {
        #region Consts
        private const string DefaultBettypeSessionKey = "Fanex.NAP.TGRS.Reports.MultipleMatchesTrader.DefaultBettype";
        private const string TeamsSessionKey = "Fanex.NAP.TGRS.Reports.MultipleMatchesTrader.Teams";
        private const string MultipleMatchesTraderPerformanceSessionKey = "Fanex.NAP.TGRS.Reports.MultipleMatchesTrader.TraderPerformance";
        private const int PointInPixel = 225;
        private const string SpaceBlank = " ";
        #endregion

        public IEnumerable<BetTypeDefaultItem> GetBetTypes(int userId, BettypeViewPermission permission = BettypeViewPermission.All)
        {
            List<BetTypeDefaultItem> betTypes = null;
            var criteria = new GetBetTypesCriteria(permission) { UserId = userId };
            var data = this.GetData<BetTypeDefaultInfo>(criteria);

            if (data != null && data.Any())
            {
                var betTypeList = new List<Int16>() { 1, 3, 7, 8 };
                betTypes = data.Select(obj => new BetTypeDefaultItem(obj))
                            .Where(obj => betTypeList.Contains(obj.BetTypeId))
                            .OrderBy(obj=>obj.BetTypeName)
                            .ToList();
                SessionManager.Set<List<BetTypeDefaultItem>>(DefaultBettypeSessionKey, betTypes);
            }
            
            return betTypes ?? new List<BetTypeDefaultItem>();
        }

        public IEnumerable<TeamItem> GetTeams()
        {
            var criteria = new GetTeamsCriteria();
            var teamData = this.GetData<TeamInfo>(criteria);
            IEnumerable<TeamItem> teams = new List<TeamItem>();

            if (teamData.Any())
            {
                teams = teamData.Select(obj => new TeamItem(obj));
                SessionManager.Set<List<TeamItem>>(TeamsSessionKey, teams.ToList());
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

                traderPerformance.GroupTraderList = traderPerformance.GroupTraderList.ToList();
                traderPerformance.GrandTotal.Margin = CalculateTotalMargin(traderPerformance.GrandTotal.WinLoss, traderPerformance.GrandTotal.Turnover);
                traderPerformance.TotalItems = traderData.Count();

                SessionManager.Set<TraderPerformanceList>(MultipleMatchesTraderPerformanceSessionKey, traderPerformance);
            }            

            return traderPerformance;
        }

        public MatchPerformanceList GetMatchPerformanceOfTrader(GetMatchPerformanceOfTraderCriteria criteria, bool isGroupingMatchDetail)
        {
            var matchPerformance = new MatchPerformanceList();
            var matchData = this.GetData<MatchPerformanceInfo>(criteria);
            var matchGroups = matchData.GroupBy(obj => obj.MatchGroup);
            MatchPerformanceGroup matchGroup = null;

            foreach (IGrouping<int, MatchPerformanceInfo> group in matchGroups)
            {
                matchGroup = new MatchPerformanceGroup(group.Key);
                matchGroup.AddMatchList(group, isGroupingMatchDetail);
                matchGroup.Total.Margin = CalculateTotalMargin(matchGroup.Total.WinLoss, matchGroup.Total.Turnover);

                matchPerformance.AddItem(matchGroup);
            }

            matchPerformance.GroupMatchList = matchPerformance.GroupMatchList.ToList();
            matchPerformance.GrandTotal.Margin = CalculateTotalMargin(matchPerformance.GrandTotal.WinLoss, matchPerformance.GrandTotal.Turnover);
            matchPerformance.TotalItems = matchData.Count();

            return matchPerformance;
        }

        public BetTypeList GetBettypeTrader(GetBettypeDetailOfTraderCriteria criteria, string subMatchIds)
        {
            var betTypeList = new BetTypeList();
            var betTypeInfos = new List<BetTypeInfo>();
            var betTypeDefaultItems = SessionManager.Get<List<BetTypeDefaultItem>>(DefaultBettypeSessionKey);

            if (!string.IsNullOrEmpty(subMatchIds))
            {
                var arrSubMatchId = subMatchIds.Split(',');

                foreach (var subMatchId in arrSubMatchId)
                {
                    criteria.MatchId = int.Parse(subMatchId);

                    betTypeInfos.AddRange(this.GetData<BetTypeInfo>(criteria));
                }                
            }
            else
            {
                betTypeInfos.AddRange(this.GetData<BetTypeInfo>(criteria));
            }

            betTypeList.AddBettypeList(betTypeInfos, betTypeDefaultItems);
            betTypeList.Total.Margin = CalculateTotalMargin(betTypeList.Total.WinLoss, betTypeList.Total.Turnover);

            return betTypeList;
        }

        private decimal CalculateTotalMargin(decimal winLoss, decimal turnover)
        {
            if (turnover != 0)
            {
                return winLoss / turnover * 100;
            }

            return 0;
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
            var gradeIds = criteria.GradeIds == SpaceBlank ? ViewLang.All : criteria.GradeIds;
            var multipleMatches = criteria.MultipleMatches == SpaceBlank ? ViewLang.All : criteria.MultipleMatches.Replace("5,6,7,8,9,10", ">=5");

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Grade, boldFont, gradeIds, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Team, boldFont, GetTeamNames(criteria.TeamIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, GetBettypes(criteria.Bettypes), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.MultipleMatches, boldFont, multipleMatches, normalFont, "\n");

            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(7, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private string GetBettypes(string bettypes)
        {
            var bettypeList = SessionManager.Get<List<BetTypeDefaultItem>>(DefaultBettypeSessionKey);
            if (bettypes == SpaceBlank)
            {
                return ViewLang.All;
            }
            var bettypeIdsList = Array.ConvertAll(bettypes.Split(','), s => Int16.Parse(s)).ToList();
            var bettypeNames = bettypeList.AsEnumerable().Join(bettypeIdsList, a => a.BetTypeId, b => b, (a, b) => a.BetTypeName);

            return string.Join(",", bettypeNames);
        }

        private string GetTeamNames(string teamIds)
        {
            var teamList = SessionManager.Get<List<TeamItem>>(TeamsSessionKey);
            if (teamIds == SpaceBlank)
            {
                return ViewLang.All;
            }
            var teamIdsList = Array.ConvertAll(teamIds.Split(','), s => Int16.Parse(s)).ToList();
            var teamNames = teamList.AsEnumerable().Join(teamIdsList, a => a.TeamId, b => b, (a, b) => a.TeamName);

            return string.Join(",", teamNames);
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
            foreach (var group in data.GroupTraderList)
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
                        item.Count,
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
                    total.Count,
                    total.Turnover,
                    total.WinLoss,
                    total.BetCount,
                    (object)total.Margin ?? ViewLang.NA
                };
            writer.WriteRow(6, totalRecord);
        }      
    }
}