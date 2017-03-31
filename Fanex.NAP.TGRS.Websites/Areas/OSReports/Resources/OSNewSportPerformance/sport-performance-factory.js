/* File Created: Aug 10, 2016 */
/*jshint strict: false*/
/* global  common */

var sportPerformanceFactory = (function ($) {
    var urls = {
        GetAllSports: common.ResolveRootUrl('OSNewSportPerformance/GetAllSports'),
        GetSportPerformance: common.ResolveRootUrl('OSNewSportPerformance/GetSportPerformance'),
        GetLeaguePerformance: common.ResolveRootUrl('OSNewSportPerformance/GetLeaguePerformance'),
        GetRegionPerformance: common.ResolveRootUrl('OSNewSportPerformance/GetRegionsPerformanceBySport'),
        GetBettypePerformance: common.ResolveRootUrl('OSNewSportPerformance/GetBettypePerformance')
    };

    return {
        GetAllSports: function () {
            return $.get(urls.GetAllSports);
        },

        GetSportPerformance: function (criteria) {
            return $.get(urls.GetSportPerformance, criteria);
        },

        GetLeaguePerformance: function (criteria) {
            return $.get(urls.GetLeaguePerformance, criteria);
        },

        GetRegionPerformance: function (criteria) {
            return $.get(urls.GetRegionPerformance, criteria);
        },

        GetBettypePerformance: function (criteria) {
            return $.get(urls.GetBettypePerformance, criteria);
        }
    }
})(jQuery);
