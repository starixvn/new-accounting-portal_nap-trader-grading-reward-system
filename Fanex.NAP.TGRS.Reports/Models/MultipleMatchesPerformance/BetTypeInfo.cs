namespace Fanex.NAP.TGRS.Reports.Models.MultipleMatchesPerformance
{
    /// <summary>
    /// Bet type detail model.
    /// </summary>
    public class BetTypeInfo
    {
        public short? BetType { get; set; }

        public string TypeName { get; set; }

        public decimal? Turnover { get; set; }

        public decimal? WinLoss { get; set; }

        public int? BetCount { get; set; }

        public decimal? Margin { get; set; }      
    }
}