namespace Fanex.NAP.TGRS.Reports.Models.Trader
{
    using System;

    public class TraderWinlossTurnover
    {
        public DateTime WLDate { get; set; }

        public decimal Turnover { get; set; }

        public decimal WinLoss { get; set; }

        public decimal TurnoverReal { get; set; }

        public decimal WinLossReal { get; set; }

        public string DisplayDate 
        {
            get
            {
                return WLDate.ToString("dd/MM/yy");
            }
        }
    }
}
