namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data;
    using Fanex.Data.Repository;
    using System;

    public class GetBetChoicePerformanceOfBetTypeCriteria : CriteriaBase
    {
        [SpParam(Ignored = true)]
        public bool IsLive { get; set; }

        public Int16 Market
        {
            get
            {
                if (this.IsLive)
                {
                    return 1;
                }

                return 0;
            }
        }

        public short BetType { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public string LeagueGroupIds { get; set; }

        public string LeagueName { get; set; }

        [SpParam(Ignored = true)]
        public bool IsReal { get; set; }

        [SpParam(Ignored = true)]
        public bool IsVirtual { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_Bettype_BetChoice";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}