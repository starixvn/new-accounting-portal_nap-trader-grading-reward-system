using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.TGRS.OSReports.Criteria.TraderPerformance
{
    public class GetSportByTraderCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_OS_Rpt_SportPerformanceGetByTraderId";
        }
    }
}
