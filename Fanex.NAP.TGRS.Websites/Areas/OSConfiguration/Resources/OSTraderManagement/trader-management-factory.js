/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global  common */

var traderManagementFactory = (function ($) {
    var urls = {
        GetTraders: common.ResolveRootUrl('OSTraderManagement/GetTraders'),
        GetTraderTeamHistory: common.ResolveRootUrl('OSTraderManagement/GetTraderTeamHistory'),
        GetTraderGradeHistory: common.ResolveRootUrl('OSTraderManagement/GetTraderGradeHistory'),
        GetTraderEPADeduction: common.ResolveRootUrl('OSTraderManagement/GetTraderEPADeduction'),
        GetTraderError: common.ResolveRootUrl('OSTraderManagement/GetTraderError'),
        InsertTrader: common.ResolveRootUrl('OSTraderManagement/InsertTrader'),
        InsertTraderIssue: common.ResolveRootUrl('OSTraderManagement/InsertTraderIssue'),
        UpdateTrader: common.ResolveRootUrl('OSTraderManagement/UpdateTrader')
    };

    return {
        GetTraders: function (criteria) {
            return $.get(urls.GetTraders, criteria);
        },

        InsertTrader: function (grade) {
            return $.post(urls.InsertTrader, grade);
        },

        UpdateTrader: function (grade) {
            return $.post(urls.UpdateTrader, grade);
        },

        GetTraderTeamHistory: function (traderId) {
            return $.get(urls.GetTraderTeamHistory, traderId);
        },

        GetTraderGradeHistory: function (traderId) {
            return $.get(urls.GetTraderGradeHistory, traderId);
        },

        GetTraderEPADeduction: function (traderId) {
            return $.get(urls.GetTraderEPADeduction, traderId);
        },

        GetTraderError: function (traderId) {
            return $.get(urls.GetTraderError, traderId);
        },

        InsertTraderIssue: function (traderError) {
            return $.post(urls.InsertTraderIssue, traderError);
        }
    }
})(jQuery);