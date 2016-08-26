var ScoreConfirmationService = (function ($) {
    var ScoreConfirmationService = {};
    ScoreConfirmationService.TraderScores = [];
    ScoreConfirmationService.Result = [];

    ScoreConfirmationService.GetTraderScores = function (criteria) {
        return ScoreConfirmationFactory.GetTraderScores(criteria)
        .success(function (result) {
            ScoreConfirmationService.TraderScores = result;
        })
        .error(function (xhr) {
            common.HandleAjaxError(xhr);
        })
        .complete(function () {
            common.EnableInput();
        });
    }

    ScoreConfirmationService.StoreTraderConfirmedScores = function (criteria) {
        return ScoreConfirmationFactory.StoreTraderConfirmedScores(criteria)
        .success(function (result) {
            ScoreConfirmationService.Result = result;
        })
        .error(function (xhr) {
            common.HandleAjaxError(xhr);
        })
        .complete(function () {
            common.EnableInput();
        });
    }

    return ScoreConfirmationService;
})(jQuery)