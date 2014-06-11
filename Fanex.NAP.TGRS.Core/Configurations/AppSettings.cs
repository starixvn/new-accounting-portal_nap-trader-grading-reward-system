// --------------------------------------------------------------------------
// <copyright file="AppSettings.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.3.3">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.Configurations
{
    using System;
    using System.Configuration;
    using Fanex.Common;

    /// <summary>
    /// Application settings.
    /// </summary>
    public static class AppSettings
    {
        private static string serverTimezone;
        private static int performanceYearRange;
        private static int performanceAllowYearRange;
        private static int performanceDefaultDayRange;
        private static DateTime? availableDate;

        public static string ServerTimezone
        {
            get
            {
                if (serverTimezone == null)
                {
                    serverTimezone = GetValue("ServerTimezone");
                }

                return serverTimezone;
            }
        }

        public static int PerformanceYearRange
        {
            get
            {
                if (performanceYearRange == 0)
                {
                    performanceYearRange = Converter.ToInt(GetValue("PerformanceYearRange"));
                }

                return performanceYearRange;
            }
        }

        public static int PerformanceAllowYearRange
        {
            get
            {
                if (performanceAllowYearRange == 0)
                {
                    performanceAllowYearRange = Converter.ToInt(GetValue("PerformanceAllowYearRange"));
                }

                return performanceAllowYearRange;
            }
        }

        public static int PerformanceDefaultDayRange
        {
            get
            {
                if (performanceDefaultDayRange == 0)
                {
                    performanceDefaultDayRange = Converter.ToInt(GetValue("PerformanceDefaultDayRange"));
                }

                return performanceDefaultDayRange;
            }
        }

        public static DateTime AvailableDate
        {
            get
            {
                if (availableDate == null)
                {
                    availableDate = Converter.ToDateTime(GetValue("AvailableDate"));
                }

                return availableDate.Value;
            }
        }

        /// <summary>
        /// Gets the value from web configuration.
        /// </summary>
        /// <param name="key">The key which is used to identify the value.</param>
        /// <returns>Associated value of passed key.</returns>
        private static string GetValue(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }
    }
}