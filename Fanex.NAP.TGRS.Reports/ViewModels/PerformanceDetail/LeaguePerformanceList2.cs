namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;    
    using System.Collections.Generic;
    using System.Linq;

    public class LeaguePerformanceList2
    {
        public LeaguePerformanceList2()
        {
            this.ItemByOrderList = new List<LeaguePerformanceItem2>();
            this.ItemLiveList = new List<LeaguePerformanceItem2>();
            this.ItemNonLiveList = new List<LeaguePerformanceItem2>();
            this.Total = new LeaguePerformanceItem2();
            this.TotalItemLive = new LeaguePerformanceItem2();
            this.TotalItemNonLive = new LeaguePerformanceItem2();
        }

        public List<LeaguePerformanceItem2> ItemByOrderList { get; set; }

        public List<LeaguePerformanceItem2> ItemLiveList { get; set; }

        public List<LeaguePerformanceItem2> ItemNonLiveList { get; set; }

        public LeaguePerformanceItem2 Total { get; set; }

        public LeaguePerformanceItem2 TotalItemLive { get; set; }

        public LeaguePerformanceItem2 TotalItemNonLive { get; set; }

        public void AddLeagueList(IEnumerable<LeaguePerformanceInfo2> leaguePerformanceInfos)
        {
            var leagueGroups = SessionManager.Get<List<LeagueGroup>>("Fanex.NAP.TGRS.Reports.LeagueGroups");

            foreach (var item in leaguePerformanceInfos)
            {
                if (item != null)
                {
                    var leagueGroupName = string.Empty;
                    if (leagueGroups != null && item.LeagueGroupID.HasValue)
                    {
                        var group = leagueGroups
                            .Where(x => x.LeagueGroupId.Equals(item.LeagueGroupID.Value))
                            .Select(x => x.LeagueGroupName).ToList();

                        leagueGroupName = group.Any() ? group[0] : "-";
                    }
                    var itemData = new LeaguePerformanceItem2(item);
                    itemData.LeagueGroupName = leagueGroupName;

                    this.AddItem(itemData);
                }
            }
        }

        public void AddLeagueList(IEnumerable<LeaguePerformanceInfo2> leaguePerformanceInfos, bool isLive)
        {
            var leagueGroups = SessionManager.Get<List<LeagueGroup>>("Fanex.NAP.TGRS.Reports.LeagueGroups");

            foreach (var item in leaguePerformanceInfos)
            {
                if (item != null)
                {
                    var leagueGroupName = string.Empty;
                    if (leagueGroups != null && item.LeagueGroupID.HasValue)
                    {
                        var group = leagueGroups
                            .Where(x => x.LeagueGroupId.Equals(item.LeagueGroupID.Value))
                            .Select(x => x.LeagueGroupName).ToList();
                     
                        leagueGroupName = group.Any() ? group[0] : "-";
                    }
                    var itemData = new LeaguePerformanceItem2(item);
                    itemData.LeagueGroupName = leagueGroupName;

                    this.AddItem(itemData, isLive);
                }
            }
        }

        public void CalculateTotalMargin()
        {
            if (this.Total != null)
            {
                this.Total.Margin = CalculateTotalMargin(this.Total.WinLoss, this.Total.Turnover);
                this.Total.MarginReal = CalculateTotalMargin(this.Total.WinLossReal, this.Total.TurnoverReal);
            }

            if (this.TotalItemLive != null)
            {
                this.TotalItemLive.Margin = CalculateTotalMargin(this.TotalItemLive.WinLoss, this.TotalItemLive.Turnover);
                this.TotalItemLive.MarginReal = CalculateTotalMargin(this.TotalItemLive.WinLossReal, this.TotalItemLive.TurnoverReal);
            }

            if (this.TotalItemNonLive != null)
            {
                this.TotalItemNonLive.Margin = CalculateTotalMargin(this.TotalItemNonLive.WinLoss, this.TotalItemNonLive.Turnover);
                this.TotalItemNonLive.MarginReal = CalculateTotalMargin(this.TotalItemNonLive.WinLossReal, this.TotalItemNonLive.TurnoverReal);
            }
        }

        private void AddItem(LeaguePerformanceItem2 item)
        {
            this.ItemByOrderList.Add(item);

            CalculateTotal(item, item.IsLive);
        }

        private void AddItem(LeaguePerformanceItem2 item, bool isLive)
        {
            if (isLive)
            {
                this.ItemLiveList.Add(item);
            }
            else
            {
                this.ItemNonLiveList.Add(item);
            }

            CalculateTotal(item);
        }

        private void CalculateTotal(LeaguePerformanceItem2 item)
        {
            this.Total.NoOfTraders += item.NoOfTraders;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.NoOfBetChoices += item.NoOfBetChoices;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.TurnoverReal += item.TurnoverReal;
            this.Total.WinLossReal += item.WinLossReal;
            this.Total.BetCount += item.BetCount;
        }

        private void CalculateTotal(LeaguePerformanceItem2 item, bool isLive)
        {
            if (isLive)
            {
                this.TotalItemLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemLive.Turnover += item.Turnover;
                this.TotalItemLive.WinLoss += item.WinLoss;
                this.TotalItemLive.TurnoverReal += item.TurnoverReal;
                this.TotalItemLive.WinLossReal += item.WinLossReal;
                this.TotalItemLive.BetCount += item.BetCount;
            }
            else
            {
                this.TotalItemNonLive.NoOfTraders += item.NoOfTraders;
                this.TotalItemNonLive.NoOfMatches += item.NoOfMatches;
                this.TotalItemNonLive.Turnover += item.Turnover;
                this.TotalItemNonLive.WinLoss += item.WinLoss;
                this.TotalItemNonLive.TurnoverReal += item.TurnoverReal;
                this.TotalItemNonLive.WinLossReal += item.WinLossReal;
                this.TotalItemNonLive.BetCount += item.BetCount;
            }
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
    }
}
