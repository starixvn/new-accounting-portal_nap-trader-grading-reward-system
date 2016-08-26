var ScoreConfirmationFactory = (function ($) {
    var urls = {
        GetTraderScores: common.ResolveRootUrl('OSScoreConfirmation/GetTraderScores'),
        StoreTraderConfirmedScores: common.ResolveRootUrl('OSScoreConfirmation/StoreTraderConfirmedScores')
    };

    return {
        GetTraderScores: function (criteria) {
            return $.get(urls.GetTraderScores, criteria);
        },

        StoreTraderConfirmedScores: function (criteria) {
            return $.get(urls.StoreTraderConfirmedScores, criteria);
        }
    }
})(jQuery);
