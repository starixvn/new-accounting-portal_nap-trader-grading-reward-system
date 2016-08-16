/* File Created: Aug 10, 2016 */
/*jshint strict: false*/
/* global  common */

var sportPerformanceFactory = (function ($) {
    var urls = {
        GetAllSports: common.ResolveRootUrl('OSSportPerformance/GetAllSports'),
        GetSportPerformance: common.ResolveRootUrl('OSSportPerformance/GetSportPerformance'),
        GetLeaguePerformance: common.ResolveRootUrl('OSSportPerformance/GetLeaguePerformance'),
        GetBettypePerformance: common.ResolveRootUrl('OSSportPerformance/GetBettypePerformance')
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

        GetBettypePerformance: function (criteria) {
            return $.get(urls.GetBettypePerformance, criteria);
        }
    }
})(jQuery);
