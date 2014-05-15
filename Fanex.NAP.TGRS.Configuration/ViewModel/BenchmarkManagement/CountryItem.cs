// --------------------------------------------------------------------------
// <copyright file="CountryItem.cs" company="Nexcel Solutions Vietnam">
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
    using Fanex.NAP.TGRS.Core.Helpers;

    /// <summary>
    /// Country view model.
    /// </summary>
    [Serializable]
    public class CountryItem
    {
        public CountryItem()
        {
        }

        public CountryItem(Country countryCode)
        {
            if (countryCode != null)
            {
                this.CountryCode = countryCode.CountryCode;
                this.CountryName = CacheRef.GetCountryName(this.CountryCode);

                if (string.IsNullOrEmpty(this.CountryName))
                {
                    this.CountryName = this.CountryCode;
                }
            }
        }

        public string CountryCode { get; set; }

        public string CountryName { get; set; }
    }
}