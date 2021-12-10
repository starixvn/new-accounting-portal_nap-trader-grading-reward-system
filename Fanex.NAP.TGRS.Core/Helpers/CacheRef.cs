// --------------------------------------------------------------------------
// <copyright file="CacheRef.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Jason.Ly" date="2014.5.15">Created</change>
// </history>

namespace Fanex.NAP.TGRS.Core.Helpers
{
    using Fanex.Common;
    using RemotingRef;

    /// <summary>
    /// Caching remote data.
    /// </summary>
    public static class CacheRef
    {
        private static readonly RemotingRefService refService = new RemotingRefService();

        /// <summary>
        /// Gets bet type name.
        /// </summary>
        /// <param name="bettypeId">Bet type ID.</param>
        /// <returns>Bet type name.</returns>
        public static string GetBetType(object bettypeId)
        {
            return GetBetType(bettypeId, null);
        }

        public static string GetQuarter(object betTypeId, object betId)
        {
            return GetBetType(betTypeId, betId);
        }

        /// <summary>
        /// Gets bet type name by bet type ID and bet ID.
        /// </summary>
        /// <param name="betTypeId">Bet type ID.</param>
        /// <param name="betId">Bet ID value.</param>
        /// <returns>Bet type name.</returns>
        public static string GetBetType(object betTypeId, object betId)
        {
            // resourceId remove first character
            string resourceId = string.Empty;
            if (betId != null && betId.ToString().Length > 1)
            {
                resourceId = betId.ToString().Substring(1);
            }

            return refService.GetBetTypeName(betTypeId.ToString(), TWLang("en-US"), string.Empty, resourceId);
        }      

        /// <summary>
        /// Gets sport name by ID.
        /// </summary>
        /// <param name="sportId">Sport ID value.</param>
        /// <returns>Sport name.</returns>
        public static string GetSportName(object sportId)
        {
            return refService.GetSportName(Converter.ToString2(sportId), TWLang("en-US"), string.Empty);
        }

        /// <summary>
        /// Gets team name.
        /// </summary>
        /// <param name="teamId">Team ID value.</param>
        /// <returns>Team name.</returns>
        public static string GetTeamName(object teamId)
        {
            return refService.GetTeamName(Converter.ToString2(teamId), TWLang("en-US"), string.Empty);
        }

        /// <summary>
        /// Gets league name by ID.
        /// </summary>
        /// <param name="leagueId">League ID.</param>
        /// <returns>League name.</returns>
        public static string GetLeagueName(object leagueId)
        {
            return refService.GetLeagueName(Converter.ToString2(leagueId), TWLang("en-US"), string.Empty);
        }

        /// <summary>
        /// Gets odd type name.
        /// </summary>
        /// <param name="oddsType">Odd type ID.</param>
        /// <returns>Odd type name.</returns>
        public static string GetOddsTypeName(object oddsType)
        {
            return refService.GetOddsTypeName(Converter.ToString2(oddsType), TWLang("en-US"));
        }

        /// <summary>
        /// Gets the name of the country.
        /// </summary>
        /// <param name="countryCode">The country code.</param>
        /// <returns>The country name.</returns>
        public static string GetCountryName(string countryCode)
        {
            return refService.GetCountryName(countryCode, TWLang("en-US"));
        }

        /// <summary>
        /// Gets combination name.
        /// </summary>
        /// <param name="betTeam">Bet team name.</param>
        /// <returns>Combination name.</returns>
        public static string GetCombinationName(string betTeam)
        {
            string name = string.Empty;
            switch (betTeam)
            {
                case "110":
                    name = "Trixie";
                    break;

                case "1110":
                    name = "Yankee";
                    break;

                case "11110":
                    name = "Canadian";
                    break;

                case "111110":
                    name = "Heinz";
                    break;

                case "1111110":
                    name = "Super Heinz";
                    break;

                case "11111110":
                    name = "Goliath";
                    break;
            }

            return name;
        }

        /// <summary>
        /// Gets language ID.
        /// </summary>
        /// <param name="lang">Language string.</param>
        /// <returns>Language ID.</returns>
        private static string TWLang(string lang)
        {
            switch (lang)
            {
                case "en-US": return "en"; // US English
                case "zh-TW": return "ch"; // Traditional
                case "zh-CN": return "cs"; // Simplified
                case "ja-JP": return "jp"; // Japanese
                case "th-TH": return "th"; // Thai
                default: return "en";
            }
        }
    }
}