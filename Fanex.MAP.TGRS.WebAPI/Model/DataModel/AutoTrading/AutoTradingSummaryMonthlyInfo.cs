namespace Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading
{
    using System;

    public class AutoTradingSummaryMonthlyInfo : AutoTradingSummaryInfo
    {
        public DateTime RptMonth { get; set; }

        public string LeagueIdList { get; set; }
    }
}