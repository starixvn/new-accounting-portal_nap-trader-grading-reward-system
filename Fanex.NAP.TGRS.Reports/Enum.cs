namespace Fanex.NAP.TGRS.Reports
{
    public enum Market
    {
        None,
        All,
        Live,
        NonLive
    }

    public enum AutoTradingType
    {
        BetType,
        LeagueGroup,
        League,
        PeriodWeek,
        PeriodMonth,
        Match
    }

    public enum BasketballChartName
    {
        WinLoss,
        Turnover,
        Margin,
        MatchCount,
        BetCount
    }

    public enum BasketballDays
    {
        CustomMonth,
        Today,
        Days7,
        Days30
    }
}