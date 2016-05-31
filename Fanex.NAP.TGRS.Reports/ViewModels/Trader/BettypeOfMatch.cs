namespace Fanex.NAP.TGRS.Reports.ViewModels.Trader
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public class BettypeOfMatch
    {
        public int Bettype { get; set; }

        public string TypeName { get; set; }

        public decimal Turnover { get; set; }

        public decimal Winlost { get; set; }

        public int BetCount { get; set; }

        public decimal Margin { get; set; }
    }
}
