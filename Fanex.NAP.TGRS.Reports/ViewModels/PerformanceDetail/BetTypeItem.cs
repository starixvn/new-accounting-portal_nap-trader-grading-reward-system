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
        private static Random rnd = new Random();

        public BetTypeItem(BetTypeInfo betType)
        {
            if (betType != null)
            {
                this.BetTypeId = betType.BetType;
                this.BetTypeName = betType.TypeName;
                this.IsDefaultCheck = betType.IsDefaultCheck;

                //// Ken: for test
                int randNum = rnd.Next(1, 100);
                this.IsDefaultCheck = rnd.Next(1, 100) > 50 ? true : false;
            }
        }

        public short BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public bool IsDefaultCheck { get; set; }
    }
}