// -----------------------------------------------------------------------
// <copyright file="ISportPerformanceService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.08.10">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSReports.Services.SportPerformance
{
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using System.Collections.Generic;

    public interface ISportPerformanceService
    {
        List<Sport> GetAllSport();
    }
}
