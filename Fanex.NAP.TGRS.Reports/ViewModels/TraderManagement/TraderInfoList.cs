// -----------------------------------------------------------------------
// <copyright file="TraderInfoList.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.12">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModel.TraderManagement
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// List of Trader Info Item.
    /// </summary>
    [Serializable]
    public class TraderInfoList
    {
        public TraderInfoList()
        {
            this.TraderInfoItems = new List<TraderInfoItem>();
        }

        public List<TraderInfoItem> TraderInfoItems { get; set; }

        public void Add(TraderInfoItem teamInfoItem)
        {
            if (teamInfoItem != null)
            {
                TraderInfoItems.Add(teamInfoItem);
            }
        }
    }
}
