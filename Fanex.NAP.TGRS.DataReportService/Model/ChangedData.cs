namespace Fanex.NAP.TGRS.DataReportService.Model
{
    public class ChangedData
    {
        public int MatchId { get; set; }

        public int HomeId { get; set; }

        public int AwayId { get; set; }

        public string Bettype { get; set; }

        #region old

        public string OldTraderName { get; set; }

        public double? OldTurnover { get; set; }

        public double? OldWinLost { get; set; }

        public int? OldBetCount { get; set; }

        #endregion old

        #region new

        public string NewTraderName { get; set; }

        public double? NewTurnover { get; set; }

        public double? NewWinLost { get; set; }

        public int? NewBetCount { get; set; }

        #endregion new

        protected bool Equal(ChangedData data)
        {
            return OldTurnover == data.OldTurnover
                && OldWinLost == data.OldWinLost
                && OldBetCount == data.OldBetCount
                && NewBetCount == data.NewBetCount
                && NewTurnover == data.NewTurnover
                && NewWinLost == data.NewWinLost;
        }
    }
}