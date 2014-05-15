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
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.Framework.Data;
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

        /// <summary>
        /// Updates league benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that contain updated benchmark value.</param>
        /// <returns>ICommandResult object indicates if the updating process is successful or not.</returns>
        ICommandResult UpdateLeagueBenchmark(UpdateLeagueBenchmarkCriteria criteria);

        /// <summary>
        /// Gets the profit margin.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of ProfitMarginItem objects.</returns>
        IEnumerable<ProfitMarginItem> GetProfitMargin(CriteriaBase criteria);

        /// <summary>
        /// Gets the team benchmark data that are satisfied the passed conditions.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of TeamBenchmarkItem objects.</returns>
        IEnumerable<TeamBenchmarkItem> GetTeamBenchmark(GetTeamBenchmarkCriteria criteria);

        /// <summary>
        /// Updates team benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that contain updated benchmark value.</param>
        /// <returns>ICommandResult object indicates if the updating process is successful or not.</returns>
        ICommandResult UpdateTeamBenchmark(UpdateTeamBenchmarkCriteria criteria);

        /// <summary>
        /// Gets the bet type benchmark data that are satisfied the passed conditions.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of BetTypeBenchmarkItem objects.</returns>
        IEnumerable<BetTypeBenchmarkItem> GetBetTypeBenchmark(GetBetTypeBenchmarkCriteria criteria);

        /// <summary>
        /// Updates bet type benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that contain updated benchmark value.</param>
        /// <returns>ICommandResult object indicates if the updating process is successful or not.</returns>
        ICommandResult UpdateBetTypeBenchmark(UpdateBetTypeBenchmarkCriteria criteria);
    }
}