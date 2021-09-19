namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetIntervalPerformanceOfBetTypeLeagueBetChoiceCriteria : CriteriaBase
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

        public int LeagueId { get; set; }

        public short BetType { get; set; }

        public string BetTeam { get; set; }

        public decimal Oddsspread { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public override string GetSettingKey()
            => "TGRS_Rpt_PerformanceDetail_Bettype_League_BetChoice_Interval";

        public override bool IsValid()
            => true;
    }
}
