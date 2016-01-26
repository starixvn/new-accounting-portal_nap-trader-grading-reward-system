namespace Fanex.NAP.TGRS.Configuration.Models.SpreadManagement
{
    using System;
    using TGRS.Core.ExcelUtility;

    public class SpreadChecker
    {
        [Column("League ID")]
        public string LeagueId { get; set; }

        [Column("League Name")]
        public string LeagueName { get; set; }

        [Column("Bet Type ID")]
        public string BetTypeId { get; set; }

        [Column("Bet Type Name")]
        public string BetTypeName { get; set; }

        public string Spread { get; set; }

        public static explicit operator SpreadInfo(SpreadChecker checker)
        {
            try
            {
                return new SpreadInfo
                {
                    LeagueId = int.Parse(checker.LeagueId),
                    LeagueName = checker.LeagueName,
                    BetTypeId = int.Parse(checker.BetTypeId),
                    BetTypeName = checker.BetTypeName,
                    Spread = int.Parse(checker.Spread)
                };
            }
            catch
            {
                return null;
            }
        }
    }
}
