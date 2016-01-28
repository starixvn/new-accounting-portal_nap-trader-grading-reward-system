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
    using Core.BaseClasses;
    using Criteria.Common;

    /// <summary>
    /// Common service.
    /// </summary>
    public class CommonService : TGRSBaseService
    {
        /// <summary>
        /// Gets the list of bet types Id.
        /// </summary>
        /// <returns>List of bet types Id.</returns>
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