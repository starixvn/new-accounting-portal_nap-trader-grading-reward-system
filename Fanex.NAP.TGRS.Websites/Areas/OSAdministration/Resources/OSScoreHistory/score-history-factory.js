/* File Created: Aug 26, 2016 */
/*jshint strict: false*/
/* global  common */

var scoreHistoryFactory = (function ($) {
    var urls = {
        GetAllScoreHistory: common.ResolveRootUrl('OSScoreHistory/GetAllScoreHistory'),
        DeleteScoreHistory: common.ResolveRootUrl('OSScoreHistory/DeleteScoreHistory'),
        GetScoreHistoryByPeriod: common.ResolveRootUrl('OSScoreHistory/GetScoreHistoryByPeriod')
    };

    return {
        GetAllScoreHistory: function () {
            return $.get(urls.GetAllScoreHistory);
        },

        DeleteScoreHistory: function (criteria) {
            return $.post(urls.DeleteScoreHistory, criteria);
        },

        GetScoreHistoryByPeriod: function (criteria) {
            return $.get(urls.GetScoreHistoryByPeriod, criteria);
        }
    }
})(jQuery);
