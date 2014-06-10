// --------------------------------------------------------------------------
// <copyright file="DetailReportService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.6.9">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Reports.Services.Implements
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.Reports.Criteria.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Models.PerformanceDetail;
    using Fanex.NAP.TGRS.Reports.Services.Interfaces;
    using Fanex.NAP.TGRS.Reports.ViewModels.PerformanceDetail;

    /// <summary>
    /// Detail report service.
    /// </summary>
    public class DetailReportService : TGRSBaseService, IDetailReportService
    {
        /// <summary>
        /// Gets the bet types.
        /// </summary>
        /// <returns>List of BetTypeItem objects.</returns>
        public IEnumerable<BetTypeItem> GetBetTypes()
        {
            var criteria = new GetBetTypesCriteria();
            IEnumerable<BetTypeInfo> data = this.GetData<BetTypeInfo>(criteria);
            IEnumerable<BetTypeItem> betTypes = data.Select(obj => new BetTypeItem(obj));

            return betTypes;
        }
    }
}