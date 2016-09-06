/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global  common */

var traderManagementFactory = (function ($) {
    var urls = {
        GetTraders: common.ResolveRootUrl('OSTraderManagement/GetTraders'),
        GetTraderTeamHistory: common.ResolveRootUrl('OSTraderManagement/GetTraderTeamHistory'),
        GetTraderGradeHistory: common.ResolveRootUrl('OSTraderManagement/GetTraderGradeHistory'),
        InsertTrader: common.ResolveRootUrl('OSTraderManagement/InsertTrader'),
        UpdateTrader: common.ResolveRootUrl('OSTraderManagement/UpdateTrader'),
        GetTeam: common.ResolveRootUrl("OSTraderManagement/GetTeamName"),
        GetGrade: common.ResolveRootUrl("OSTraderManagement/GetGradeName")
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

        GetTeam: function() {
            return $.get(urls.GetTeam);
        },

        GetGrade: function () {
            return $.get(urls.GetGrade);
        }
    }
})(jQuery);