// -----------------------------------------------------------------------
// <copyright file="TraderInfoList.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron.Cao" date="2016.1.22">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.SpreadManagement
{
    using System;
    using System.Collections.Generic;
    using Models.SpreadManagement;

    /// <summary>
    /// List of Trader Info Item.
    /// </summary>
    [Serializable]
    public class SpreadInfoList
    {
        public SpreadInfoList()
        {
            SpreadInfoItems = new List<SpreadInfoModel>();
        }

        public IEnumerable<SpreadInfoModel> SpreadInfoItems { get; set; }

        public int TotalItem { get; set; }
    }
}
