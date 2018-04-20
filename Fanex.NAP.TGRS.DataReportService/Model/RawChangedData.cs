namespace Fanex.NAP.TGRS.DataReportService.Model
{
    public class RawChangedData : ChangedData
    {
        public int MatchId { get; set; }

        public string Username { get; set; }

        public string Bettype { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public int BettypeId { get; set; }
    }
}