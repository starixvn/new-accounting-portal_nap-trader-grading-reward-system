// --------------------------------------------------------------------------
// <copyright file="BenchmarkManagementService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.BenchmarkManagement
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.Framework.Data;
    using Fanex.NAP.TGRS.Configuration.Criteria.BenchmarkManagement;
    using Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement;
    using Fanex.NAP.TGRS.Configuration.ViewModel.BenchmarkManagement;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Benchmark management service.
    /// </summary>
    public class BenchmarkManagementService : TGRSBaseService, IBenchmarkManagementService
    {
        /// <summary>
        /// Gets the list of countries which have active leagues.
        /// </summary>
        /// <returns>List of CountryItem objects.</returns>
        public IEnumerable<CountryItem> GetCountryList()
        {
            IEnumerable<Country> rawData = this.GetData<Country>(new GetCountryCodesCriteria());
            IEnumerable<CountryItem> result = null;

            if (rawData.Any())
            {
                result = rawData.Select(obj => new CountryItem(obj));
                result = result.OrderBy(obj => obj.CountryName);
            }

            return result;
        }

        /// <summary>
        /// Gets the list of special leagues.
        /// </summary>
        /// <returns>List of SpecialLeagueItem objects.</returns>
        public IEnumerable<SpecialLeagueItem> GetSpecialLeagueList()
        {
            IEnumerable<SpecialLeague> rawData = this.GetData<SpecialLeague>(new GetSpecialLeaguesCriteria());
            IEnumerable<SpecialLeagueItem> result = null;

            if (rawData.Any())
            {
                result = rawData.Select(obj => new SpecialLeagueItem(obj));
                result = result.OrderBy(obj => obj.DisplayName);
            }

            return result;
        }

        /// <summary>
        /// Gets the league benchmark data that are satisfied the passed conditions.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of LeagueBenchmarkItem objects.</returns>
        public IEnumerable<LeagueBenchmarkItem> GetLeagueBenchmark(GetLeagueBenchmarkCriteria criteria)
        {
            IEnumerable<LeagueBenchmark> rawData = this.GetData<LeagueBenchmark>(criteria);
            IEnumerable<LeagueBenchmarkItem> result = null;

            if (rawData.Any())
            {
                result = rawData.Select(obj => new LeagueBenchmarkItem(obj));
                result = result.OrderBy(obj => obj.LeagueName);
            }

            return result;
        }

        /// <summary>
        /// Updates league benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that contain updated benchmark value.</param>
        /// <returns>ICommandResult object indicates if the updating process is successful or not.</returns>
        public ICommandResult UpdateLeagueBenchmark(UpdateLeagueBenchmarkCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        /// <summary>
        /// Gets the profit margin of a league.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of ProfitMarginItem objects.</returns>
        public IEnumerable<ProfitMarginItem> GetProfitMargin(CriteriaBase criteria)
        {
            IEnumerable<ProfitMargin> rawData = this.GetData<ProfitMargin>(criteria);
            IEnumerable<ProfitMarginItem> result = null;

            if (rawData.Any())
            {
                result = rawData.Select(obj => new ProfitMarginItem(obj));
                result = result.OrderBy(obj => obj.Year);
            }

            return result;
        }

        /// <summary>
        /// Gets the team benchmark data that are satisfied the passed conditions.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of TeamBenchmarkItem objects.</returns>
        public IEnumerable<TeamBenchmarkItem> GetTeamBenchmark(GetTeamBenchmarkCriteria criteria)
        {
            IEnumerable<TeamBenchmark> rawData = this.GetData<TeamBenchmark>(criteria);
            IEnumerable<TeamBenchmarkItem> result = null;

            if (rawData.Any())
            {
                result = rawData.Select(obj => new TeamBenchmarkItem(obj));
                result = result.OrderBy(obj => obj.TeamName);
            }

            return result;
        }

        /// <summary>
        /// Updates team benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that contain updated benchmark value.</param>
        /// <returns>ICommandResult object indicates if the updating process is successful or not.</returns>
        public ICommandResult UpdateTeamBenchmark(UpdateTeamBenchmarkCriteria criteria)
        {
            return this.UpdateData(criteria);
        }

        /// <summary>
        /// Gets the bet type benchmark data that are satisfied the passed conditions.
        /// </summary>
        /// <param name="criteria">The criteria that are used to query data.</param>
        /// <returns>List of BetTypeBenchmarkItem objects.</returns>
        public IEnumerable<BetTypeBenchmarkItem> GetBetTypeBenchmark(GetBetTypeBenchmarkCriteria criteria)
        {
            IEnumerable<BetTypeBenchmark> rawData = this.GetData<BetTypeBenchmark>(criteria);
            IEnumerable<BetTypeBenchmarkItem> result = null;

            if (rawData.Any())
            {
                result = rawData.Select(obj => new BetTypeBenchmarkItem(obj));
            }

            return result;
        }

        /// <summary>
        /// Updates bet type benchmark.
        /// </summary>
        /// <param name="criteria">The criteria that contain updated benchmark value.</param>
        /// <returns>ICommandResult object indicates if the updating process is successful or not.</returns>
        public ICommandResult UpdateBetTypeBenchmark(UpdateBetTypeBenchmarkCriteria criteria)
        {
            return this.UpdateData(criteria);
        }
    }
}