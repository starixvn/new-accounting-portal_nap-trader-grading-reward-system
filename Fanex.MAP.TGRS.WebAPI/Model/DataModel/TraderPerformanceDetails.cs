namespace Fanex.NAP.TGRS.WebAPI.Model
{
    public class TraderPerformanceDetails
    {
        public int? TraderId { get; set; }

        public int? BetType { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }
    }
}