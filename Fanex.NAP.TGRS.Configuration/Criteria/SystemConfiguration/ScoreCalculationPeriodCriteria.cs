// -----------------------------------------------------------------------
// <copyright file="ScoreCalculationPeriodCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration
{
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class ScoreCalculationPeriodCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "TGRS_Setting_ScorePeriodSel";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}