namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;

    [Serializable]
    public class TimeMachinePerformanceItem
    {
        public TimeMachinePerformanceItem() { }

        public TimeMachinePerformanceItem(TimeMachinePerformanceInfo info, short betType)
        {
            this.Minute = ConvertMinute(info.HDP1, betType);
            this.NoOfLeagues = Converter.ToInt(info.LeagueCount);
            this.NoOfMatches = Converter.ToInt(info.MatchCount);
            this.BetCount = Converter.ToInt(info.BetCount);
            this.Turnover = info.Turnover;
            this.WinLoss = info.WinLoss;
            this.Margin = info.Margin;
            this.TurnoverReal = info.TurnoverReal;
            this.WinLossReal = info.WinLossReal;
            this.MarginReal = info.MarginReal;
        }

        public string Minute { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }

        private string ConvertMinute(decimal hdp1, short betType)
        {
            var minute = string.Empty;

            if (betType == 228)
            {
                minute = "Before Minute " + (hdp1 + 1).ToString("N0");
            }
            else if(betType == 229)
            {
                if (hdp1 < 10)
                {
                    minute = "00:00" + " - " + "0" + (hdp1 + 1).ToString("N0") + ":00";
                }
                else
                {
                    minute = "00:00" + " - " + (hdp1 + 1).ToString("N0") + ":00";
                }
            }

            return minute;
        }
    }
}
