// -----------------------------------------------------------------------
// <copyright file="ScoreCalculationPeriod.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.TGRS.Configuration.Models.SystemConfiguration
{
    using System;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class ScoreCalculationPeriod
    {
        public DateTime BeginDay { get; set; }

        public DateTime EndDay { get; set; }

        public DateTime SelectedDay { get; set; }
    }
}