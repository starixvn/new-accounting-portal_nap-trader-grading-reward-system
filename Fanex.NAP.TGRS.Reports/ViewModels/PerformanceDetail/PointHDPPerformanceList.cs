namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.NAP.TGRS.Core.Configurations;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Serializable]
    public class PointHDPPerformanceList
    {
        public PointHDPPerformanceList()
        {
            this.ItemList = new List<PointHDPPerformanceItem>();
            this.Total = new PointHDPPerformanceItem();
        }     

        public List<PointHDPPerformanceItem> ItemList { get; set; }

        public PointHDPPerformanceItem Total { get; set; }

        public bool IsTotalGoalBetType { get; set; }

        public void AddItem(IEnumerable<PointHDPPerformanceInfo> infos, short betType, string betTeam)
        {
            var totalGoalBettypes = AppSettings.SoccerTotalGoalBettype;

            this.IsTotalGoalBetType = totalGoalBettypes.Any(x => x == betType.ToString());

            var betOption = ConvertOption(betTeam);

            foreach (var info in infos)
            {
                if (info != null)
                {
                    var item = new PointHDPPerformanceItem(info, betType, betOption);

                    this.ItemList.Add(item);

                    CalculateTotal(item);
                }
            }
        }

        private string ConvertOption(string betTeam)
        {
            if (betTeam == "Away")
            {
                return "a";
            }
            else if (betTeam == "Home")
            {
                return "h";
            }
            else
            {
                return betTeam;
            }
        }

        private void CalculateTotal(PointHDPPerformanceItem item)
        {
            this.Total.NoOfLeagues += item.NoOfLeagues;
            this.Total.NoOfMatches += item.NoOfMatches;
            this.Total.Turnover += item.Turnover;
            this.Total.WinLoss += item.WinLoss;
            this.Total.TurnoverReal += item.TurnoverReal;
            this.Total.WinLossReal += item.WinLossReal;
            this.Total.BetCount += item.BetCount;
        }
    }
}
