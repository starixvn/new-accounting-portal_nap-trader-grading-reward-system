// --------------------------------------------------------------------------
// <copyright file="SpreadChecker.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Simon.Huynh" date="2015.1.26">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.SpreadManagement
{
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
                    BetTypeId = int.Parse(checker.BetTypeId),                    
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