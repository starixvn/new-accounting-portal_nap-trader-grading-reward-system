using Fanex.Common;
using System;

namespace Fanex.NAP.TGRS.OSReports.ViewModel.BasketballPerformance
{
    [Serializable]
    public class BetTypeOfLeaguePerformanceItem
    {
        public BetTypeOfLeaguePerformanceItem() { }
        public BetTypeOfLeaguePerformanceItem(BetTypeOfLeaguePerformanceInfo betTypeData)
        {
            if (betTypeData?.BetTypeId == null) return;
            this.BetTypeId = betTypeData.BetTypeId.Value;
            this.BetTypeName = betTypeData.BetTypeName;
            this.BetCount = Converter.ToInt(betTypeData.BetCount);
            this.Turnover = Converter.ToDecimal(betTypeData.Turnover);
            this.WinLoss = Converter.ToDecimal(betTypeData.WinLoss);
            this.Margin = betTypeData.Margin;
            this.Turnover_AR = Converter.ToDecimal(betTypeData.Turnover_AR);
            this.WinLoss_AR = Converter.ToDecimal(betTypeData.WinLoss_AR);
            this.Margin_AR = betTypeData.Margin_AR;
        }
        public int? BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal Margin { get; set; }

        public decimal Turnover_AR { get; set; }

        public decimal WinLoss_AR { get; set; }

        public decimal Margin_AR { get; set; }
    }
}
