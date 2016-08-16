// -----------------------------------------------------------------------
// <copyright file="SportPerformanceService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Aaron" date="2016.08.10">Created</change>
// </history>

namespace Fanex.NAP.TGRS.OSReports.Services.SportPerformance
{
    using Fanex.NAP.TGRS.Core.BaseClasses;
    using Fanex.NAP.TGRS.OSReports.Criteria.SportPerformance;
    using Fanex.NAP.TGRS.OSReports.Models.SportPerformance;
    using System.Collections.Generic;
    using System.Linq;

    public class SportPerformanceService : TGRSBaseService, ISportPerformanceService
    {
        public List<Sport> GetAllSport()
        {
            var result = this.GetData<Sport>(new GetAllSportsCriteria());

            return result != null ? result.ToList() : new List<Sport>();
        }

        public List<SportPerformanceItem> GetSportPerformance(GetSportPerformanceCriteria criteria)
        {
            var result = this.GetData<SportPerformanceItem>(criteria);

            return result != null ? result.ToList() : new List<SportPerformanceItem>();
        }

        public List<LeaguePerformanceItem> GetLeaguePerformance(GetLeaguePerformanceCriteria criteria)
        {
            var result = this.GetData<LeaguePerformanceItem>(criteria);

            return result != null ? result.ToList() : new List<LeaguePerformanceItem>();
        }

        public List<BettypePerformanceItem> GetBettypePerformance(GetBettypePerformanceCriteria criteria)
        {
            var result = this.GetData<BettypePerformanceItem>(criteria);

            return result != null ? result.ToList() : new List<BettypePerformanceItem>();
        }
    }
}
