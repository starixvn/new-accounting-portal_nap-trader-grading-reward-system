/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, scoreHistoryFactory */

var scoreHistoryService = (function ($) {
    var scoreHistoryService = {};
    scoreHistoryService.ScoreHistory = [];
    scoreHistoryService.ScoreHistoryDetails = [];
    scoreHistoryService.Result = [];

    scoreHistoryService.GetAllScoreHistory = function () {
        common.DisableInput();
        return scoreHistoryFactory.GetAllScoreHistory()
            .success(function (result) {
                scoreHistoryService.ScoreHistory = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    scoreHistoryService.DeleteScoreHistory = function (criteria) {
        common.DisableInput();
        return scoreHistoryFactory.DeleteScoreHistory(criteria)
            .success(function (result) {
                scoreHistoryService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    scoreHistoryService.GetScoreHistoryByPeriod = function (criteria) {
        common.DisableInput();
        return scoreHistoryFactory.GetScoreHistoryByPeriod(criteria)
            .success(function (result) {
                scoreHistoryService.ScoreHistoryDetails = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    return scoreHistoryService;
})(jQuery);
