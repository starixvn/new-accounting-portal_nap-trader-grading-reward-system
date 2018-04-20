namespace Fanex.NAP.TGRS.DataReportService.Model
{
    using System.Collections.Generic;
    using System.Linq;

    public class ChangedDataList
    {
        private ChangedDataList(IEnumerable<ChangedTrader> traders, IEnumerable<ChangedMatch> matches)
        {
            Traders = traders;
            Matches = matches;
        }

        public ChangedDataList(IEnumerable<RawChangedData> raw)
        {
            Traders =
                raw
                    .GroupBy(r => r.Username)
                    .Select(g => new ChangedTrader
                    {
                        TraderName = g.Key,
                        Bettypes = g.GroupBy(a => a.BettypeId).ToDictionary(a => a.Key, a => a.First().Bettype),
                        OldBetCount = g.Sum(r => r.OldBetCount),
                        OldTurnover = g.Sum(r => r.OldTurnover),
                        OldWinLoss = g.Sum(r => r.OldWinLoss),
                        NewBetCount = g.Sum(r => r.NewBetCount),
                        NewTurnover = g.Sum(r => r.NewTurnover),
                        NewWinLoss = g.Sum(r => r.NewWinLoss)
                    }).ToList();

            Matches =
                raw
                    .GroupBy(r => r.MatchId)
                    .Select(g => new ChangedMatch
                    {
                        MatchId = g.Key,
                        AwayId = g.First().AwayId,
                        HomeId = g.First().HomeId,
                        Bettypes = g.ToDictionary(a => a.BettypeId, a => a.Bettype),
                        OldBetCount = g.Sum(r => r.OldBetCount),
                        OldTurnover = g.Sum(r => r.OldTurnover),
                        OldWinLoss = g.Sum(r => r.OldWinLoss),
                        NewBetCount = g.Sum(r => r.NewBetCount),
                        NewTurnover = g.Sum(r => r.NewTurnover),
                        NewWinLoss = g.Sum(r => r.NewWinLoss)
                    }).ToList();
        }

        public IEnumerable<ChangedTrader> Traders { get; }

        public IEnumerable<ChangedMatch> Matches { get; }

        public static ChangedDataList operator - (ChangedDataList data1, ChangedDataList data2)
        {
            var trader2 = data2.Traders.ToDictionary(tr => tr.TraderName);
            var newTrader = new Queue<ChangedTrader>();

            foreach (var item in data1.Traders)
            {
                if (!trader2.ContainsKey(item.TraderName) || item != trader2[item.TraderName])
                {
                    newTrader.Enqueue(item);
                }
            }

            var match2 = data2.Matches.ToDictionary(m => m.MatchId);
            var newMatch = new Queue<ChangedMatch>();

            foreach (var item in data1.Matches)
            {
                if(!match2.ContainsKey(item.MatchId) || item != match2[item.MatchId])
                {
                    newMatch.Enqueue(item);
                }
            }

            return new ChangedDataList(newTrader, newMatch);
        }
    }
}