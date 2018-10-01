namespace Fanex.NAP.TGRS.Configuration.Models.LeagueExclusion
{
    public class League
    {
        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public bool IsExcluded { get; set; }
    }
}