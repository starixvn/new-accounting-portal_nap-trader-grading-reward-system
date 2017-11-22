// -----------------------------------------------------------------------
// <copyright file="ISystemConfigurationService.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.5.14">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.Services.SystemConfiguration
{
    using Fanex.NAP.TGRS.Configuration.Models.BettypeManagement;
    using System.Collections.Generic;

    public interface IBettypeManagement
    {
        IEnumerable<Bettype> GetBettypes();
    }
}