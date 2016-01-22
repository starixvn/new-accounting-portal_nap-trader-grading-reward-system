// --------------------------------------------------------------------------
// <copyright file="CommonService.cs.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Thai.Tran" date="2016.01.22">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.CommonService
{
    using System.Collections.Generic;
    using Fanex.NAP.TGRS.Configuration.Criteria.Common;
    using Fanex.NAP.TGRS.Core.BaseClasses;

    /// <summary>
    /// Common service.
    /// </summary>
    public class CommonService : TGRSBaseService
    {
        /// <summary>
        /// Gets the list of bettypes Id.
        /// </summary>
        /// <returns>List of bettypes Id.</returns>
        public IEnumerable<int> GetBettypeIdsList()
        {
            IEnumerable<int> result = this.GetData<int>(new GetBetTypeIdsCriteria());
            return result;
        }        

        /// <summary>
        /// Gets the list of leagues Id.
        /// </summary>
        /// <returns>List of leagues Id.</returns>
        public IEnumerable<int> GetLeagueIdsList()
        {
            IEnumerable<int> result = this.GetData<int>(new GetLeagueIdsCriteria());
            return result;
        }        
    }
}