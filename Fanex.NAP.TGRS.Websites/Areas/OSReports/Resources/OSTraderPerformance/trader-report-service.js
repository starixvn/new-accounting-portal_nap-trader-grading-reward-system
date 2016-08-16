var TraderReportService = (function ($) {
    return {
        GetTraderPerformance: function (criteria, callback) {
            TraderReportFactory.GetTraderPerformance(criteria)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        },

        GetSportsPerformance: function (criteria, callback) {
            TraderReportFactory.GetSportsPerformance(criteria)
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