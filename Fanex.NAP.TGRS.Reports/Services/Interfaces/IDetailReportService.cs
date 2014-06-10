// --------------------------------------------------------------------------
// <copyright file="IDetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services.Interfaces
{
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;

    public interface IDetailReportService
    {
        /// <summary>
        /// Gets the bet types.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        IEnumerable<BetTypeItem> GetBetTypes();
    }
}