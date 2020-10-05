namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.ExcelUtility;
    using Fanex.NAP.TGRS.Core.ExcelUtility.RichTextExtensions;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Core.Resources;
    using Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance;
    using NPOI.SS.UserModel;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class BasketballBetTypeService : TGRSBaseService, IBasketballBetTypeService
    {
        private const int PointInPixel = 225;
        private const string LeagueGroupsSessionKey = "Fanex.NAP.TGRS.OSReports.Basketball.BetTypePerformance.LeagueGroups";
        private const string BettypesSessionKey = "Fanex.NAP.TGRS.OSReports.Basketball.BetTypePerformance.Bettypes";
        private const string BetTypePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.OSReports.Basketball.BetTypePerformance.GetBetTypes";

        public IEnumerable<LeagueGroup> GetLeagueGroups()
        {
            var leagueGroupList = new List<LeagueGroup>();

            var criteria = new GetLeagueGroupBySportCriteria {  SportId = 2 };

            var data = this.GetData<LeagueGroupInfo>(criteria);

            if (data != null && data.Any())
            {
                leagueGroupList = data.Select(x => new LeagueGroup
                {
                    LeagueGroupId = x.LeagueGroupID,
                    LeagueGroupName = x.LeagueGroupName
                }).ToList();

                SessionManager.Set<List<LeagueGroup>>(LeagueGroupsSessionKey, leagueGroupList);
            }            

            return leagueGroupList;
        }

        public IEnumerable<GroupBettypes> GetGroupBetTypes()
        {
            var groupBettypes = Enumerable.Empty<GroupBettypes>();
            var criteria = new GetBettypesCriteria();
            var data = this.GetData<BettypeInfo>(criteria);

            if (data != null && data.Any())
            {
                groupBettypes = data
                    .GroupBy(g => new { g.GroupBettypeId, g.GroupBettypeName })
                    .Select(x => new { Group = x.Key, BetTypeList = x.ToList() })
                    .Select(x => new GroupBettypes
                    {
                        GroupId = x.Group.GroupBettypeId,
                        GroupName = x.Group.GroupBettypeName,                        
                        BetTypeList = x.BetTypeList.Select(y => new Bettype
                        {
                            BetTypeId = y.BettypeId,
                            BetTypeName = y.BettypeName                            
                        })
                    });

                var cacheBettypes = data.Select(x => new Bettype
                {
                    BetTypeId = x.BettypeId,
                    BetTypeName = x.BettypeName
                }).ToList();

                SessionManager.Set<List<Bettype>>(BettypesSessionKey, cacheBettypes);
            }            

            return groupBettypes;
        }

        public BettypePerformanceList GetBettypePerformance(GetBettypePerformanceCriteria criteria)
        {
            var bettypeList = new BettypePerformanceList();
            
            var betTypeData = this.GetData<BettypePerformanceInfo>(criteria);

            if (betTypeData != null && betTypeData.Any())
            {
                foreach (var info in betTypeData)
                {
                    bettypeList.AddBettype(info);
                }

                bettypeList.CalculateMargin(bettypeList.TotalItemLive);
                bettypeList.CalculateMargin(bettypeList.TotalItemNonLive);

                SessionManager.Set<BettypePerformanceList>(BetTypePerformanceDetailReportSessionKey, bettypeList);
            }

            return bettypeList;
        }

        public BetChoiceOfBettypeList GetBetChoiceOfBettype(GetBetChoiceOfBettypeCriteria criteria)
        {
            var betChoiceList = new BetChoiceOfBettypeList();

            var betChoiceData = this.GetData<BetChoiceOfBettypeInfo>(criteria);

            if (betChoiceData != null && betChoiceData.Any())
            {
                foreach (var info in betChoiceData)
                {
                    betChoiceList.AddBetChoice(info);
                }

                betChoiceList.CalculateMargin(betChoiceList.Total);
            }

            return betChoiceList;
        }

        public LeagueOfBettypeBetChoiceList GetLeagueOfBettypeBetChoice(GetLeagueOfBettypeBetChoiceCriteria criteria)
        {
            var leagueList = new LeagueOfBettypeBetChoiceList();

            var leagueData = this.GetData<LeagueOfBettypeBetChoiceInfo>(criteria);

            if (leagueData != null && leagueData.Any())
            {
                var leagueGroupList = SessionManager.Get<List<LeagueGroup>>(LeagueGroupsSessionKey);
                if (leagueGroupList == null)
                    leagueGroupList = new List<LeagueGroup>();

                foreach (var info in leagueData)
                {
                    var group = leagueGroupList.FirstOrDefault(x => x.LeagueGroupId == info.LeagueGroupID);

                    var leagueGroupName = group != null ? group.LeagueGroupName : string.Empty;

                    leagueList.AddLeague(info, leagueGroupName);
                }

                leagueList.CalculateMargin(leagueList.Total);
            }

            return leagueList;
        }

        public TraderOfBettypeList GetTraderOfBettype(GetTraderOfBettypeCriteria criteria)
        {
            var traderList = new TraderOfBettypeList();

            var traderData = this.GetData<TraderOfBettypeInfo>(criteria);

            if (traderData != null && traderData.Any())
            {
                foreach (var info in traderData)
                {
                    traderList.AddTrader(info);
                }

                traderList.CalculateMargin(traderList.Total);
            }

            return traderList;
        }

        public MatchOfBettypeTraderList GetMatchOfBettypeTrader(GetMatchOfBettypeTraderCriteria criteria)
        {
            var matchList = new MatchOfBettypeTraderList();

            var matchData = this.GetData<MatchOfBettypeTraderInfo>(criteria);

            if (matchData != null && matchData.Any())
            {
                IEnumerable<IGrouping<int, MatchOfBettypeTraderInfo>> matchGroups = matchData.GroupBy(x => x.LeagueId);
                MatchOfBettypeTraderGroup matchGroup = null;

                foreach (IGrouping<int, MatchOfBettypeTraderInfo> group in matchGroups)
                {
                    matchGroup = new MatchOfBettypeTraderGroup(group.Key);

                    foreach (var item in group)
                    {
                        matchGroup.AddItem(item);                        
                    }
                    matchGroup.CalculateMargin(matchGroup.Total);
                    matchList.AddGroup(matchGroup);
                }

                matchList.CalculateMargin(matchList.Total);
                matchList.TotalItems = matchData.Count();
            }

            return matchList;
        }

        public LeagueOfBettypeList GetLeagueOfBettype(GetLeagueOfBettypeCriteria criteria)
        {
            var leagueList = new LeagueOfBettypeList();

            var leagueData = this.GetData<LeagueOfBettypeInfo>(criteria);
            var leagueGroupList = SessionManager.Get<List<LeagueGroup>>(LeagueGroupsSessionKey);

            if (leagueGroupList == null)
                leagueGroupList = new List<LeagueGroup>();

            if (leagueData != null && leagueData.Any())
            {
                foreach(var info in leagueData)
                {
                    var group = leagueGroupList.FirstOrDefault(x => x.LeagueGroupId == info.LeagueGroupID);

                    var leagueGroupName = group != null ? group.LeagueGroupName : string.Empty;

                    leagueList.AddLeague(info, leagueGroupName);
                }

                leagueList.CalculateMargin(leagueList.Total);
            }

            return leagueList;
        }

        public BetChoiceOfBettypeLeagueList GetBetChoiceOfBettypeLeague(GetBetChoiceOfBettypeLeagueCriteria criteria)
        {
            var betChoiceList = new BetChoiceOfBettypeLeagueList();

            var betChoiceData = this.GetData<BetChoiceOfBettypeLeagueInfo>(criteria);

            if (betChoiceData != null && betChoiceData.Any())
            {
                foreach (var info in betChoiceData)
                {
                    betChoiceList.AddBetChoice(info);
                }

                betChoiceList.CalculateMargin(betChoiceList.Total);
            }

            return betChoiceList;
        }

        public TraderOfBettypeLeagueList GetTraderOfBettypeLeague(GetTraderOfBettypeLeagueCriteria criteria)
        {
            var traderList = new TraderOfBettypeLeagueList();

            var traderData = this.GetData<TraderOfBettypeLeagueInfo>(criteria);

            if (traderData != null && traderData.Any())
            {
                foreach (var info in traderData)
                {
                    traderList.AddTrader(info);
                }

                traderList.CalculateMargin(traderList.Total);
            }

            return traderList;
        }

        public MatchOfBettypeLeagueTraderList GetMatchOfBettypeLeagueTrader(GetMatchOfBettypeLeagueTraderCriteria criteria)
        {
            var matchList = new MatchOfBettypeLeagueTraderList();

            var traderData = this.GetData<MatchOfBettypeLeagueTraderInfo>(criteria);

            if (traderData != null && traderData.Any())
            {
                foreach (var info in traderData)
                {
                    matchList.AddMatch(info);
                }

                matchList.CalculateMargin(matchList.Total);
            }

            return matchList;
        }

        public void ExportBetTypePerformance(int userId, GetBettypePerformanceCriteria criteria, string templatePath)
        {
            var betTypeData = SessionManager.Get<BettypePerformanceList>(BetTypePerformanceDetailReportSessionKey);

            if (betTypeData != null && betTypeData.Items.Count > 0)
            {
                var reportName = string.Format(
                                    ViewLang.BasketballBetTypePerformance,
                                    ViewLang.BetTypeExcelFile,
                                    criteria.FromDate.ToShortFormatedDateForFileName(),
                                    criteria.ToDate.ToShortFormatedDateForFileName());
                var writer = new ExcelTemplateWriter(templatePath, reportName, ViewLang.BasketballBetTypePerformance);

                writer.CopyRows(0, 1);
                FilterBlock(userId, criteria, ref writer);
                FillHeader(ref writer);
                writer.FreezeRow(0, 3);
                FillRowData(betTypeData, criteria.LiveType, ref writer);
                writer.SyncColumnsWidth(9);
                writer.Render();
            }
        }
        
        private void FilterBlock(int userid, GetBettypePerformanceCriteria criteria, ref ExcelTemplateWriter writer)
        {
            RichTextRender contentRender = new RichTextRender().Clear();
            IFont boldFont = writer.GetFont(10, 0);
            IFont normalFont = writer.GetFont(11, 0);
            int lineCount = 0;
          
            var liveType = criteria.LiveType == -1 ? ViewLang.MarketAll : (criteria.LiveType == 1 ? ViewLang.MarketLive : ViewLang.MarketNonLive);

            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.Market, boldFont, liveType, normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.FromDate, boldFont, criteria.FromDate.ToShortFormatedDate(), normalFont, " - ");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.ToDate, boldFont, criteria.ToDate.ToShortFormatedDate(), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.BetType, boldFont, GetCacheBettypes(criteria.Bettypes), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.LeagueGroup, boldFont, GetCacheLeagueGroup(criteria.LeagueGroupIds), normalFont, "\n");
            AppendBlockContent(ref contentRender, ref lineCount, ViewLang.League, boldFont, criteria.LeagueName, normalFont, "\n");
            
            IRichTextString contentRichTextString = contentRender.Render();
            IRichTextString[] contentRichTextArray = new IRichTextString[1];
            contentRichTextArray[0] = contentRichTextString;
            writer.WriteRow(8, contentRichTextArray);
            writer.SetRowHeight(1, PointInPixel * lineCount);
        }

        private string GetCacheBettypes(string bettypeIds)
        {
            if (!string.IsNullOrEmpty(bettypeIds))
            {
                var countBettypeId = bettypeIds.Split(',').Count();
                var cacheBettypes = SessionManager.Get<List<Bettype>>(BettypesSessionKey);
                if (cacheBettypes != null && cacheBettypes.Any())
                {
                    if (cacheBettypes.Count == countBettypeId)
                        return ViewLang.All;

                    return string.Join(", ",
                        cacheBettypes.Where(x => bettypeIds.Contains(x.BetTypeId.ToString()))
                                    .Select(x => x.BetTypeName));
                }
            }

            return string.Empty;
        }

        private string GetCacheLeagueGroup(string leagueGroupIds)
        {
            if (!string.IsNullOrEmpty(leagueGroupIds))
            {
                var countLeagueGroupIds = leagueGroupIds.Split(',').Count();
                var cacheLeagueGroups = SessionManager.Get<List<LeagueGroup>>(LeagueGroupsSessionKey);
                if (cacheLeagueGroups != null && cacheLeagueGroups.Any())
                {
                    if (cacheLeagueGroups.Count == countLeagueGroupIds)
                        return ViewLang.All;

                    return string.Join(", ",
                        cacheLeagueGroups.Where(x => leagueGroupIds.Contains(x.LeagueGroupId.ToString()))
                                        .Select(x => x.LeagueGroupName));
                }
            }
            
            return string.Empty;
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
            var charPerLine = 216;
            return Convert.ToInt32(Math.Ceiling((float)line.Length / charPerLine));
        }

        private void FillHeader(ref ExcelTemplateWriter writer)
        {
            writer.CopyRows(3, 1);
        }

        private void FillRowData(BettypePerformanceList data, int liveType, ref ExcelTemplateWriter writer)
        {
            BettypePerformanceItem item;
            var bettypeId = data.Items[0].BetTypeId;
            var bettypeCounter = 1;

            for (int i = 0; i < data.Items.Count; i++)
            {
                item = data.Items[i];

                if (item.BetTypeId != bettypeId)
                {
                    bettypeCounter++;
                    bettypeId = item.BetTypeId;
                }

                var styleIndex = bettypeCounter % 2 == 0 ? 4 : 5;

                var record = new object[]
                {
                    i + 1,
                    item.BetTypeName,
                    item.IsLive ? ViewLang.MarketLive : ViewLang.MarketNonLive,
                    item.NoOfTraders,
                    item.NoOfLeagues,
                    item.NoOfMatches,
                    item.Turnover,
                    item.Turnover / item.NoOfMatches,
                    item.WinLoss,
                    item.BetCount,
                    (object)item.Margin ?? ViewLang.NA
                };

                writer.WriteRow(styleIndex, record);
            }

            FillRowFooterData(data, liveType, ref writer);
        }

        private void FillRowFooterData(BettypePerformanceList data, int liveType, ref ExcelTemplateWriter writer)
        {
            var itemLive = new object[]
            {
                ViewLang.GrandTotal,
                null,
                ViewLang.MarketLive,
                data.TotalItemLive.NoOfTraders,
                data.TotalItemLive.NoOfLeagues,
                data.TotalItemLive.NoOfMatches,
                data.TotalItemLive.Turnover,
                data.TotalItemLive.NoOfMatches != 0 ? data.TotalItemLive.Turnover / data.TotalItemLive.NoOfMatches : 0,
                data.TotalItemLive.WinLoss,
                data.TotalItemLive.BetCount,
                (object)data.TotalItemLive.Margin ?? ViewLang.NA
            };

            var itemNonLive = new object[]
            {
                ViewLang.GrandTotal,
                null,
                ViewLang.MarketNonLive,
                data.TotalItemNonLive.NoOfTraders,
                data.TotalItemNonLive.NoOfLeagues,
                data.TotalItemNonLive.NoOfMatches,
                data.TotalItemNonLive.Turnover,
                data.TotalItemNonLive.NoOfMatches != 0 ? data.TotalItemNonLive.Turnover / data.TotalItemNonLive.NoOfMatches : 0,
                data.TotalItemNonLive.WinLoss,
                data.TotalItemNonLive.BetCount,
                (object)data.TotalItemNonLive.Margin ?? ViewLang.NA
            };

            if (liveType == 0)
            {
                writer.WriteRow(6, itemNonLive);
            }
            else if (liveType == 1)
            {
                writer.WriteRow(6, itemLive);
            }
            else
            {
                var totalRecord = new object[]
                {
                    null,
                    null,
                    ViewLang.MarketNonLive,
                    data.TotalItemNonLive.NoOfTraders,
                    data.TotalItemNonLive.NoOfLeagues,
                    data.TotalItemNonLive.NoOfMatches,
                    data.TotalItemNonLive.Turnover,
                    data.TotalItemNonLive.NoOfMatches != 0 ? data.TotalItemNonLive.Turnover / data.TotalItemNonLive.NoOfMatches : 0,
                    data.TotalItemNonLive.WinLoss,
                    data.TotalItemNonLive.BetCount,
                    (object)data.TotalItemNonLive.Margin ?? ViewLang.NA
                };
                writer.WriteRow(6, totalRecord);

                writer.WriteRow(6, itemLive);
            }
        }

    }
}
