/* File Created: Aug 10, 2016 */
/*jshint strict: false*/
/* global  common */

var sportPerformanceFactory = (function ($) {
    var urls = {
        GetSportPerformance: common.ResolveRootUrl('OSSportPerformance/GetSportPerformance'),
        GetAllSports: common.ResolveRootUrl('OSSportPerformance/GetAllSports')
    };

    return {
        GetSportPerformance: function (criteria) {
            return $.get(urls.GetSportPerformance, criteria);
        },

        GetAllSports: function () {
            return $.get(urls.GetAllSports);
        }
    }
})(jQuery);
