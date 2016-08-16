using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fanex.NAP.TGRS.OSReports.Models.TraderPerformance
{
    public class SportPerformance
    {
        public string SportName { get; set; }

        public double TotalPoint { get; set; }

        public double Margin { get; set; }

        public double Turnover { get; set; }

        public double WinLoss { get; set; }

        public int EventProductCount { get; set; }
    }
}
