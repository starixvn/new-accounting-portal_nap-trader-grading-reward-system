namespace Fanex.NAP.TGRS.Reports.Criteria.Trader
{
    using Fanex.NAP.Framework.Data;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public class GetTraderLeaguePerformanceMatchDetailCriteria : CriteriaBase
    {
        public int TraderId { get; set; }

        public int MatchId { get; set; }

        public DateTime EventDate { get; set; }

        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_TraderLeaguePerformance_MatchDetail";
        }

        public override bool IsValid()
        {
            return TraderId > 0 && MatchId > 0;
        }
    }
}
