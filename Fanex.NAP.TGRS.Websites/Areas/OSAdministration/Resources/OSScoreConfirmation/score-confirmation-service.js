var ScoreConfirmationService = (function ($) {
    var ScoreConfirmationService = {};
    ScoreConfirmationService.Result = [];

    GetTraderScores = function (criteria, callback) {
        common.DisableInput();

        return ScoreConfirmationFactory.GetTraderScores(criteria)
        .success(callback)
        .error(function (xhr) {
            common.HandleAjaxError(xhr);
        })
        .complete(function () {
            common.EnableInput();
        });
    };

    StoreTraderConfirmedScores = function (criteria) {
        common.DisableInput();

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
})(jQuery)