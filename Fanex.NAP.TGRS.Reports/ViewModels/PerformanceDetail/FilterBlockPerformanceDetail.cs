// --------------------------------------------------------------------------
// <copyright file="FilterBlockPerformanceDetail.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Tony.Nguyen" date="2023.6.27">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail
{
    using System;

    /// <summary>
    /// Filter block performance detail view model.
    /// </summary>
    [Serializable]
    public class FilterBlockPerformanceDetail
    {
        public string BetTypeName { get; set; }

        public string MarketName { get; set; }

        public string LeagueGroupName { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
    }
}
