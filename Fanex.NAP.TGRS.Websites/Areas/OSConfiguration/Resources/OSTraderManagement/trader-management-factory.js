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
        InsertTraderError: common.ResolveRootUrl('OSTraderManagement/InsertTraderError'),
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
            return $get(urls.GetTraderTeamHistory, traderId);
        },

        GetTraderGradeHistory: function (traderId) {
            return $get(urls.GetTraderGradeHistory, traderId);
        },

        GetTraderEPADeduction: function (traderId) {
            return $get(urls.GetTraderEPADeduction, traderId);
        },

        GetTraderError: function (traderId) {
            return $get(urls.GetTraderError, traderId);
        },

        InsertTraderError: function (traderError) {
            return $.post(urls.InsertTraderError, traderError);
        }
    }
})(jQuery);
