namespace Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading
{
    using System;  

    public class AutoTradingWeeklyPerformanceInfo : AutoTradingModelPerformanceInfo
    {
        public string WeekDays { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

    }
}