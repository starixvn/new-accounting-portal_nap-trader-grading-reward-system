// --------------------------------------------------------------------------
// <copyright file="BetTypeItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using System;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;

    /// <summary>
    /// Bet type view model.
    /// </summary>
    [Serializable]
    public class BetTypeItem
    {
        public BetTypeItem(BetTypeInfo betType)
        {
            if (betType != null)
            {
                this.BetTypeId = betType.BetType;
                this.BetTypeName = betType.TypeName;
            }
        }

        public short BetTypeId { get; set; }

        public string BetTypeName { get; set; }
    }
}