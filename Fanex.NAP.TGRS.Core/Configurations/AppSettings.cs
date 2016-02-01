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
        private static int batchSizeForUpdateSpread;
        private static int totalRowsForShowUpdateSpreadInProgress;
        private static int spreadMinValue;
        private static int spreadMaxValue;        

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

        public static int BatchSizeForUpdateSpread
        {
            get
            {
                if (batchSizeForUpdateSpread == 0)
                {
                    batchSizeForUpdateSpread = Converter.ToInt(GetValue("BatchSizeForUpdateSpread"));
                }

                return batchSizeForUpdateSpread;
            }
        }

        public static int ChunkToShowUpdateSpreadInProgress
        {
            get
            {
                if (totalRowsForShowUpdateSpreadInProgress == 0)
                {
                    totalRowsForShowUpdateSpreadInProgress = Converter.ToInt(GetValue("ChunkToShowUpdateSpreadInProgress"));
                }

                return totalRowsForShowUpdateSpreadInProgress;
            }
        }

        public static int SpreadMinValue
        {
            get
            {
                if (spreadMinValue == 0)
                {
                    spreadMinValue = Converter.ToInt(GetValue("SpreadMinValue"));
                }

                return spreadMinValue;
            }
        }

        public static int SpreadMaxValue
        {
            get
            {
                if (spreadMaxValue == 0)
                {
                    spreadMaxValue = Converter.ToInt(GetValue("SpreadMaxValue"));
                }

                return spreadMaxValue;
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