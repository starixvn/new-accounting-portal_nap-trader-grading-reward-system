// -----------------------------------------------------------------------
// <copyright file="SpreadInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.1.20">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Models.SpreadManagement
{
    using TGRS.Core.ExcelUtility;

    public class SpreadInfo
    {
        [Column("League ID")]
        public int LeagueId { get; set; }

        [Column("League Name")]
        public string LeagueName { get; set; }

        [Column("Bet Type ID")]
        public int BetTypeId { get; set; }

        [Column("Bet Type Name")]
        public string BetTypeName { get; set; }

        public int Spread { get; set; }
    }
}
