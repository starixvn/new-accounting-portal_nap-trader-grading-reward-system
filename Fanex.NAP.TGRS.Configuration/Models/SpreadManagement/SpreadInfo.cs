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
    public class SpreadInfo
    {

        public int LeagueId { get; set; }

        public string LeagueName { get; set; }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public int Spread { get; set; }
    }
}
