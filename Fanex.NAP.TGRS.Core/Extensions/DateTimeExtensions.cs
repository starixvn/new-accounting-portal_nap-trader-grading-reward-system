// --------------------------------------------------------------------------
// <copyright file="DateTimeExtensions.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ken.Nguyen" date="2014.6.13">Created</change>
// </history>

namespace Fanex.NAP.Core.Web
{
    using System;

    /// <summary>
    /// Contains date extension methods.
    /// </summary>
    public static class DateTimeExtensions
    {
        public const string ShortDateFormatForFileName = "yyyyMMdd";
        public const string ShortDateFormat = "MM/dd/yyyy";

        /// <summary>
        /// Format a DateTime value to short date format for file name.
        /// </summary>
        /// <param name="date">DateTime type that the method needs to be attached to.</param>
        /// <returns>Formatted date such as 20140531.</returns>
        public static string ToShortFormatedDateForFileName(this DateTime? date)
        {
            if (date.HasValue)
            {
                return date.Value.ToString(ShortDateFormat);
            }

            return string.Empty;
        }

        /// <summary>
        /// Format a DateTime value to short date format for file name.
        /// </summary>
        /// <param name="date">DateTime type that the method needs to be attached to.</param>
        /// <returns>Formatted date such as 20140531.</returns>
        public static string ToShortFormatedDateForFileName(this DateTime date)
        {
            return date.ToString(ShortDateFormatForFileName);
        }

        public static string ToShortFormatedDate(this DateTime date)
        {
            return date.ToString(ShortDateFormat);
        }

        public static string ToShortFormatedDate(this DateTime? date)
        {
            if (date.HasValue)
            {
                return date.Value.ToString(ShortDateFormat);
            }

            return string.Empty;
        }
    }
}