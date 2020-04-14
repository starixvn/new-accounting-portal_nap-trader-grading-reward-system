namespace Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading
{
    using System;  

    public class AutoTradingSummaryWeeklyInfo
    {       
        public string WeekDays { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string LeagueIdList { get; set; }

        public int LeagueCount { get; set; }        

        public int MatchCount { get; set; }

        public int BetCount { get; set; }
    }
}