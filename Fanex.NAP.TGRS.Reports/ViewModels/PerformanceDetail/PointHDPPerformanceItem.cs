namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using Fanex.Common;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using System;

    [Serializable]
    public class PointHDPPerformanceItem
    {
        public PointHDPPerformanceItem() { }

        public PointHDPPerformanceItem(PointHDPPerformanceInfo info, short betType, string betOption)
        {
            this.PointHDPConvert = ConvertPointHDP(info.PointHDP, betType, betOption);
            this.PointHDP = info.PointHDP;
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

        public string PointHDPConvert { get; set; }

        public decimal PointHDP { get; set; }

        public int NoOfLeagues { get; set; }

        public int NoOfMatches { get; set; }

        public int BetCount { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal? Margin { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public decimal? MarginReal { get; set; }     
        
        private string ConvertPointHDP(decimal pointHDP, short betType, string betOption)
        {
            var newPointHDP = string.Empty;

            switch (betType)
            {                
                case 28: // 3-Way Handicap --- Total Goal
                case 453: // 1H 3-Way Handicap --- Total Goal
                case 477: // Corner 3-Way Handicap --- Corner
                case 478: // 1H Corner 3-Way Handicap --- Corner
                    newPointHDP = "0";
                    if (betOption == "1")
                    {
                        if (pointHDP > 0)
                            newPointHDP = "-" + Math.Abs(pointHDP).ToString("0.##");
                        else if (pointHDP < 0)
                            newPointHDP = "+" + Math.Abs(pointHDP).ToString("0.##");                        
                    }
                    else if (betOption == "2")
                    {
                        if (pointHDP > 0)
                            newPointHDP = "+" + Math.Abs(pointHDP).ToString("0.##");
                        else if (pointHDP < 0)
                            newPointHDP = "-" + Math.Abs(pointHDP).ToString("0.##");
                    }
                    else
                    {
                        if (pointHDP > 0)
                            newPointHDP = "A+" + pointHDP.ToString("0.##");
                        else if (pointHDP < 0)
                            newPointHDP = "H+" + pointHDP.ToString("0.##");
                    }
                    break;                                  
                case 228: // SABA OU Time Machine --- Total Goal
                    newPointHDP = pointHDP.ToString("0.##");
                    break;
                case 229: // SABA HDP Time Machine --- Total Goal
                    if (betOption.ToUpper() == "A")
                        newPointHDP = (-1 * pointHDP).ToString("0.##");
                    else
                        newPointHDP = pointHDP.ToString("0.##");
                    break;
                default:
                    newPointHDP = pointHDP.ToString("0.##");
                    break;
            }

            return newPointHDP;
        }
    }
}
