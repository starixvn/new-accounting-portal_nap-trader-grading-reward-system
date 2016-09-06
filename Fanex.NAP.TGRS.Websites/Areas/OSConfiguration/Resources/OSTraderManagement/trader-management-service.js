/* File Created: Jul 27, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, traderManagementFactory */

var traderManagementService = (function ($) {
    var traderManagementService = {};
    traderManagementService.Traders = [];
    traderManagementService.TraderTeamHistory = [];
    traderManagementService.TraderGradeHistory = [];
    traderManagementService.TraderEPADeduction = [];
    traderManagementService.TraderError = [];
    traderManagementService.Result = [];

    traderManagementService.GetTraders = function (criteria) {
        common.DisableInput();
        return traderManagementFactory.GetTraders(criteria)
            .success(function (result) {
                traderManagementService.Traders = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    traderManagementService.GetTraderTeamHistory = function (traderId) {
        common.DisableInput();
        return traderManagementFactory.GetTraderTeamHistory(traderId)
            .success(function (result) {
                traderManagementService.TraderTeamHistory = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    traderManagementService.GetTraderGradeHistory = function (traderId) {
        common.DisableInput();
        return traderManagementFactory.GetTraderGradeHistory(traderId)
            .success(function (result) {
                traderManagementService.TraderGradeHistory = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    traderManagementService.InsertTrader = function (trader) {
        common.DisableInput();
        return traderManagementFactory.InsertTrader(trader)
            .success(function (result) {
                traderManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    traderManagementService.UpdateTrader = function (trader) {
        common.DisableInput();
        return traderManagementFactory.UpdateTrader(trader)
            .success(function (result) {
                traderManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    traderManagementService.GetTeam = function (callback) {
        return traderManagementFactory.GetTeam()
            .success(function (result) {
                callback(result);
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    traderManagementService.GetGrade = function (callback) {
        return traderManagementFactory.GetGrade()
            .success(function (result) {
                callback(result);
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    return traderManagementService;
})(jQuery);
