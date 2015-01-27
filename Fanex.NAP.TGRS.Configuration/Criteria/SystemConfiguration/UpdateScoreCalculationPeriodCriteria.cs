// -----------------------------------------------------------------------
// <copyright file="UpdateScoreCalculationPeriodCriteria.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.TGRS.Configuration.Criteria.SystemConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class UpdateScoreCalculationPeriodCriteria : CriteriaBase
    {
        public string BeginDay { get; set; }

        public string EndDay { get; set; }

        public string SelectedDay { get; set; }

        public int UserId { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override bool IsValid()
        {
            return true;
        }

        public override string GetSettingKey()
        {
            return "TGRS_Setting_ScorePeriodUpd";
        }
    }
}
