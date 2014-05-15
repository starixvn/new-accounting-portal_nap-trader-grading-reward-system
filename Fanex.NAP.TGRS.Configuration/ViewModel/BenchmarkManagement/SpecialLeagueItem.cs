// --------------------------------------------------------------------------
// <copyright file="SpecialLeagueItem.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.15">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Configuration.ViewModel.BenchmarkManagement
{
    using System;
    using Fanex.NAP.TGRS.Configuration.Models.BenchmarkManagement;
    using Fanex.NAP.TGRS.Core.Resources;

    /// <summary>
    /// Special league view model.
    /// </summary>
    [Serializable]
    public class SpecialLeagueItem
    {
        private const int OlympicMode = 1;
        private const int WorldCupMode = 2;

        public SpecialLeagueItem()
        {
        }

        public SpecialLeagueItem(SpecialLeague rawData)
        {
            if (rawData != null)
            {
                string specialLeague;

                switch (rawData.DisplayMode)
                {
                    case OlympicMode:
                        specialLeague = ViewLang.Olympic;
                        break;

                    case WorldCupMode:
                        specialLeague = ViewLang.WorldCup;
                        break;

                    default:
                        specialLeague = string.Empty;
                        break;
                }

                this.DisplayName = string.Format("{0} {1}", specialLeague, rawData.ProgramId);
                this.Code = string.Format("{0};{1}", rawData.DisplayMode, rawData.ProgramId);
            }
        }

        public string Code { get; set; }

        public string DisplayName { get; set; }
    }
}