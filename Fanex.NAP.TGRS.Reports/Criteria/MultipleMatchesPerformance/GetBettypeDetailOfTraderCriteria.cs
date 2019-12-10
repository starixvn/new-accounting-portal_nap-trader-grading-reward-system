namespace Fanex.NAP.TGRS.Reports.Criteria.MultipleMatchesPerformance
{
    using Fanex.Data.Repository;
    using System;

    public class GetBettypeDetailOfTraderCriteria : CriteriaBase
    {
        public int MatchId { get; set; }

        public DateTime EventDate { get; set; }                

        public string Bettypes { get; set; }

        public bool IsExcludeLeagues { get; set; }

        public bool Market => true;

        public override string GetSettingKey()
            => "TGRS_Rpt_MultipleMatches_Match_Bettype";

        public override bool IsValid()
            => true;
    }
}