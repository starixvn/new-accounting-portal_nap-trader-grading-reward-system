namespace Fanex.MAP.TGRS.WebAPI.Model.DataModel.AutoTrading
{
    public class AutoTradingPTPerformanceInfo
    {
        public string PTName { get; set; }

        public int MatchCount { get; set; }

        public decimal VirtualCreditMargin { get; set; }

        public decimal VirtualCashMargin { get; set; }

        public decimal VirtualTotalMargin { get; set; }

        public decimal VarianceCreditMargin { get; set; }

        public decimal VarianceCashMargin { get; set; }

        public decimal VarianceTotalMargin { get; set; }

        public decimal RealCreditMargin { get; set; }

        public decimal RealCashMargin { get; set; }

        public decimal RealTotalMargin { get; set; }
    }
}