// --------------------------------------------------------------------------
// <copyright file="IBenchmarkManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.BenchmarkManagement
{
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Configuration.Criteria.BenchmarkManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.BenchmarkManagement;

    public interface IBenchmarkManagementService
    {
        /// <summary>
        /// Gets the list of countries which have active leagues.
        /// </summary>
        /// <returns>List of CountryItem objects.</returns>
        IEnumerable<CountryItem> GetCountryList();

        /// <summary>
        /// Gets the list of special leagues.
        /// </summary>
        /// <returns>List of SpecialLeagueItem objects.</returns>
        IEnumerable<SpecialLeagueItem> GetSpecialLeagueList();

        /// <summary>
        /// Gets the league benchmark data that are satisfied the passed conditions.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of LeagueBenchmarkItem objects.</returns>
        IEnumerable<LeagueBenchmarkItem> GetLeagueBenchmark(GetLeagueBenchmarkCriteria criteria);
    }
}