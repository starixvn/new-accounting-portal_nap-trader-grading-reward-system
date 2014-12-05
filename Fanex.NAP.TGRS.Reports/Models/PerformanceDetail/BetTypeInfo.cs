// --------------------------------------------------------------------------
// <copyright file="BetTypeInfo.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Models.PerformanceDetail
{
    /// <summary>
    /// Bet type model.
    /// </summary>
    public class BetTypeInfo
    {
        public short BetType { get; set; }

        public string TypeName { get; set; }

        public bool IsDefaultCheck { get; set; }
    }
}