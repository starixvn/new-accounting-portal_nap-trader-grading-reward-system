namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetPointHDPPerformanceOfBetTypeBetChoiceCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

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

        public string BetTeam { get; set; }

        public decimal Oddsspread { get; set; }

        public string LeagueGroupIds { get; set; }

        public string LeagueName { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_PerformanceDetail_Bettype_BetChoice_HDP";

        public override bool IsValid()
            => true;
    }
}
