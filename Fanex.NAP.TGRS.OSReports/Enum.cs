namespace Fanex.NAP.TGRS.OSReports
{
    public enum Market
    {
        None,
        All,
        Live,
        NonLive
    }

    public enum OSChartName
    {
        WinLoss,
        Turnover,
        Margin,
        MatchCount,
        BetCount,
        MarketCount
    }

    public enum DayType
    {
        CustomMonth,       
        Yesterday,
        Days7,
        Days30
    }
}
