// --------------------------------------------------------------------------
// <copyright file="GetLeagueBenchmarkCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Criteria.BenchmarkManagement
{
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// The criteria that are used to get benchmarks of leagues.
    /// </summary>
    public class GetLeagueBenchmarkCriteria : CriteriaBase
    {
        public short SportType { get; set; }

        public byte DisplayMode { get; set; }

        public string ProgramId { get; set; }

        public string CountryCode { get; set; }

        public string LeagueName { get; set; }

        [SpParam(SqlParamName = "MainMarket")]
        public int AllMarket { get; set; }

        /// <summary>
        /// Gets the setting key.
        /// </summary>
        /// <returns>The setting key.</returns>
        public override string GetSettingKey()
        {
            return "TGRS_BenchmarkLeague_SelectAll";
        }

        /// <summary>
        /// Determines whether this criteria is valid.
        /// </summary>
        /// <returns>Whether this criteria is valid or not.</returns>
        public override bool IsValid()
        {
            return true;
        }
    }
}