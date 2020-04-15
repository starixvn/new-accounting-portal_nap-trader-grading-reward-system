namespace Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading
{
    using System;  

    public class AutoTradingSummaryWeeklyInfo : AutoTradingSummaryInfo
    {       
        public string WeekDays { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string LeagueIdList { get; set; }       
    }
}