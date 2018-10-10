namespace Fanex.NAP.TGRS.Reports.Criteria.Trader
{
    using Fanex.Data.Repository;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public class GetTraderLeaguePerformanceCriteria : BettypeGroupCriteria
    {
        public int TraderId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_TraderLeaguePerformance";
        }

        public override bool IsValid()
        {
            return TraderId > 0;
        }
    }
}
