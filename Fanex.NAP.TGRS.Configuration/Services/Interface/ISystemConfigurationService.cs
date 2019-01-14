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
    using System.Collections.Generic;
    using Fanex.NAP.Framework.Command;
    using Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration;
    using Fanex.NAP.TGRS.Configuration.Criteria.TraderManagement;
    using Fanex.NAP.TGRS.Configuration.Models.SystemConfiguration;
    using Fanex.NAP.TGRS.Configuration.ViewModel.TraderManagement;

    public interface ISystemConfigurationService
    {
        IEnumerable<GradeHistoryItem> GetGradeHistory(GetGradeHistoryCriteria criteria);

        ICommandResult UpdateDefaultBettype(UpdateDefaultBettypeCriteria criteria);

        List<ScoreCalculationPeriod> GetScoreCalculationPeriod(ScoreCalculationPeriodCriteria criteria);

        ICommandResult UpdateScoreCalculationPeriod(UpdateScoreCalculationPeriodCriteria criteria);

        bool GetLeagueExclusionConfig();

        ICommandResult UpdateLeagueExclusionConfig(int userId, bool onOffValue);
    }
}