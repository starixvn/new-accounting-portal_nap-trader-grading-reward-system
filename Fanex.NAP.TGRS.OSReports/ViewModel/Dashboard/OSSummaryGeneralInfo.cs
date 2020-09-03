namespace Fanex.NAP.TGRS.OSReports.ViewModel.Dashboard
{
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class OSSummaryGeneralInfo
    {
        public OSSummaryGeneralInfo()
        {
            LegendList = new List<int>();
        }

        public bool IsCrossYear { get; set; }

        public IEnumerable<Column> WinLossList { get; set; }

        public IEnumerable<Column> WinLossComparisonList { get; set; }

        public IEnumerable<Column> WinLossCrossYearList { get; set; }

        public IEnumerable<Column> WinLossCrossYearComparisonList { get; set; }

        public decimal WinLossAverage { get; set; }

        public decimal WinLossAverageComparison { get; set; }

        public IEnumerable<Column> TurnoverList { get; set; }

        public IEnumerable<Column> TurnoverComparisonList { get; set; }

        public IEnumerable<Column> TurnoverCrossYearList { get; set; }

        public IEnumerable<Column> TurnoverCrossYearComparisonList { get; set; }

        public decimal TurnoverAverage { get; set; }

        public decimal TurnoverAverageComparison { get; set; }

        public IEnumerable<Column> MarginList { get; set; }

        public IEnumerable<Column> MarginComparisonList { get; set; }

        public IEnumerable<Column> MarginCrossYearList { get; set; }

        public IEnumerable<Column> MarginCrossYearComparisonList { get; set; }

        public decimal MarginAverage { get; set; }

        public decimal MarginAverageComparison { get; set; }

        public IEnumerable<Column> BetCountList { get; set; }

        public IEnumerable<Column> BetCountComparisonList { get; set; }

        public IEnumerable<Column> BetCountCrossYearList { get; set; }

        public IEnumerable<Column> BetCountCrossComparisonList { get; set; }

        public decimal BetCountAverage { get; set; }

        public decimal BetCountAverageComparison { get; set; }

        public IEnumerable<Column> MarketCountList { get; set; }

        public IEnumerable<Column> MarketCountComparisonList { get; set; }

        public IEnumerable<Column> MarketCountCrossYearList { get; set; }

        public IEnumerable<Column> MarketCountCrossYearComparisonList { get; set; }

        public decimal MarketCountAverage { get; set; }

        public decimal MarketCountAverageComparison { get; set; }

        public List<int> LegendList { get; set; }
    }

    [Serializable]
    public class Column
    {
        public string GroupName { get; set; }

        public string Name { get; set; }

        public decimal Value { get; set; }

        public int Day { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }
    }
}
