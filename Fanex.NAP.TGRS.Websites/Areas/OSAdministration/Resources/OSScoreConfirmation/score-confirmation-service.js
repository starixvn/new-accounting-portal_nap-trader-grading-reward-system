var ScoreConfirmationService = (function ($) {
    return {
        GetTraderScores: function (criteria, callback) {
            ScoreConfirmationFactory.GetTraderScores(criteria)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        },

        StoreTraderConfirmedScores: function (criteria, callback) {
            ScoreConfirmationFactory.StoreTraderConfirmedScores(criteria)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        }
    }
})(jQuery)