namespace Fanex.NAP.TGRS.OSReports.Services.Implement
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.OSReports.Criteria.BasketballPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.BasketballPerformance;
    using Fanex.NAP.TGRS.OSReports.Services.Interface;
    using Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance;
    using System.Collections.Generic;
    using System.Linq;

    public class BasketballBetTypeService : TGRSBaseService, IBasketballBetTypeService
    {
        private const string LeagueGroupsSessionKey = "Fanex.NAP.TGRS.OSReports.Basketball.LeagueGroups";
        private const string BetTypePerformanceDetailReportSessionKey = "Fanex.NAP.TGRS.OSReports.Basketball.BetTypePerformance";

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
            var groupBetTypes = Enumerable.Empty<GroupBettypes>();
            var criteria = new GetBettypesCriteria();
            var data = this.GetData<BettypeInfo>(criteria);

            if (data != null && data.Any())
            {
                groupBetTypes = data
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
            }            

            return groupBetTypes;
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
                        matchGroup.CalculateMargin(matchGroup.Total);
                    }
                    matchList.AddGroup(matchGroup);
                }

                matchList.TotalItems = matchData.Count();
            }

            return matchList;
        }

        public LeagueOfBettypeList GetLeagueOfBettype(GetLeagueOfBettypeCriteria criteria)
        {
            var leagueList = new LeagueOfBettypeList();

            var leagueData = this.GetData<LeagueOfBettypeInfo>(criteria);

            if (leagueData != null && leagueData.Any())
            {
                foreach(var info in leagueData)
                {
                    leagueList.AddLeague(info);
                }

                leagueList.CalculateMargin(leagueList.Total);
            }

            return leagueList;
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

    }
}
