namespace Fanex.NAP.TGRS.OSConfiguration.Models.EPADeductionManagement
{
    public class EPADeductionInfo
    {
        public int TraderId { get; set; }

        public string TraderName { get; set; }

        public decimal PointDeduction { get; set; }

        public int ErrorCount { get; set; }

        public int LeaveCount { get; set; }
    }
}
