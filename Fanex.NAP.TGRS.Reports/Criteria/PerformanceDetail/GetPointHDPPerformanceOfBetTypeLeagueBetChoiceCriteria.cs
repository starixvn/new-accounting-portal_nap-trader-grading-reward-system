namespace Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail
{
    using Fanex.Data.Repository;
    using System;

    public class GetPointHDPPerformanceOfBetTypeLeagueBetChoiceCriteria : CriteriaBase
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

        public int LeagueId { get; set; }

        public string BetTeam { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public override string GetSettingKey()
        {
            return "TGRS_Rpt_PerformanceDetail_Bettype_League_BetChoice_PointHDP";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
