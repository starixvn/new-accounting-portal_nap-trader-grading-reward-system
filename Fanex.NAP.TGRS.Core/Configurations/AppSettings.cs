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
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
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
        private static int spreadMinValue;
        private static int spreadMaxValue;
        private static string basketballBettypeQuarter;
        private static string soccerTotalGoalBettype;

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

        public static bool IsLocalTest
        {
            get
            {
                return Converter.ToInt(GetValue("IsLocalTest")) > 0;
            }
        }

        public static string BasketballBettypeQuarter
        {
            get
            {
                if (basketballBettypeQuarter == null)
                {
                    basketballBettypeQuarter = GetValue("BasketballBettypeQuarter");
                }

                return basketballBettypeQuarter;
            }
        }

        public static IEnumerable<string> SoccerTotalGoalBettype
        {
            get
            {
                var betTypes = Enumerable.Empty<string>();

                if (soccerTotalGoalBettype == null)
                {
                    soccerTotalGoalBettype = GetValue("SoccerTotalGoalBettype");
                }

                if (soccerTotalGoalBettype != null)
                {
                    betTypes = soccerTotalGoalBettype.Split(',').AsEnumerable();
                }

                return betTypes;
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