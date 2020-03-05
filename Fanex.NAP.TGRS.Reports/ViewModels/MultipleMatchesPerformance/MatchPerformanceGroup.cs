namespace Fanex.NAP.TGRS.Reports.ViewModels.MultipleMatchesPerformance
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Common;
    using Fanex.NAP.TGRS.Core.Consts;
    using Fanex.NAP.TGRS.Core.Helpers;
    using Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance;

    /// <summary>
    /// Match performance group view model.
    /// </summary>
    [Serializable]
    public class MatchPerformanceGroup
    {
        public MatchPerformanceGroup()
        {
            this.ItemList = new LinkedList<MatchPerformanceItem>();
            this.Total = new MatchPerformanceItem();
        }

        public MatchPerformanceGroup(int matchGroup)
            : this()
        {
            this.MatchGroup = matchGroup;
        }

        public int MatchGroup { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }        

        public string RangeDateValue
        {
            get
            {
                var fromValue = this.FromDate.HasValue
                    ? this.FromDate.Value.ToShortDateString() + " " + this.FromDate.Value.ToShortTimeString()
                    : string.Empty;
                var toValue = this.ToDate.HasValue
                    ? this.ToDate.Value.ToShortDateString() + " " + this.ToDate.Value.ToShortTimeString()
                    : string.Empty;

                return fromValue + " - " + toValue;
            }
        }

        private void ArrangeRangeDate(MatchPerformanceInfo item)
        {
            if (this.FromDate == null || this.FromDate > item.GlobalShowTime)
            {
                this.FromDate = item.GlobalShowTime;
            }
            if (this.ToDate == null || this.ToDate < item.GlobalShowTime)
            {
                this.ToDate = item.GlobalShowTime;
            }
        }

        public ICollection<MatchPerformanceItem> ItemList { get; set; }

        public MatchPerformanceItem Total { get; set; }
       
        public void AddMatchList(IGrouping<int, MatchPerformanceInfo> grouping, bool isGroupingMatchDetail)
        {
            var groupOrder = grouping.OrderBy(c => c.GlobalShowTime);

            foreach (var info in groupOrder)
            {
                if (!isGroupingMatchDetail && info.ParentId > 0)
                {
                    var subMatchItem = this.ItemList.FirstOrDefault(x => x.ParentId.Equals(info.ParentId) 
                                                            && x.LeagueName.Equals(info.LeagueName));

                    if (subMatchItem == null)
                    {
                        var matchItem = AddMatchItem(info);
                        matchItem.GenerateMatchNameDisplay();

                        continue;
                    }
                   
                    if (subMatchItem.TeamHomeName.Contains(Consts.MultipleMatchesMatchKeyET) 
                        || subMatchItem.TeamHomeName.Contains(Consts.MultipleMatchesMatchKeyPEN))
                    {
                        subMatchItem.GenerateMatchNameDisplayETOrPEN(CacheRef.GetTeamName(info.HomeId), CacheRef.GetTeamName(info.AwayId));
                    }

                    subMatchItem.ChildMatchIdList.Add(Converter.ToInt(info.MatchId));
                    subMatchItem.BetCount += Converter.ToInt(info.BetCount);
                    subMatchItem.Turnover += Converter.ToDecimal(info.Turnover);
                    subMatchItem.WinLoss += Converter.ToDecimal(info.WinLoss);
                    subMatchItem.Margin = CalculateMargin(subMatchItem.WinLoss, subMatchItem.Turnover);

                    continue;
                }

                AddMatchItem(info);
            }
        }

        private MatchPerformanceItem AddMatchItem(MatchPerformanceInfo info)
        {
            this.ArrangeRangeDate(info);

            var matchItem = new MatchPerformanceItem(info);

            this.ItemList.Add(matchItem);

            CalculateTotal(matchItem);

            return matchItem;
        }

        private void CalculateTotal(MatchPerformanceItem item)
        {
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.BetCount += item.BetCount;
        }

        private decimal CalculateMargin(decimal winLoss, decimal turnover)
        {
            if (turnover != 0)
            {
                return winLoss / turnover * 100;
            }

            return 0;
        }
    }
}