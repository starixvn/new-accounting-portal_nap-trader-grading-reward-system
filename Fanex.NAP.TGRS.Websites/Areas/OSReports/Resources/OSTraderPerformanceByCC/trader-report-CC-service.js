var TraderReportCCService = (function ($) {
    var traderReportCCService = {};

    traderReportCCService.GetTraderPerformanceCC = function (criteria, callback) {
        TraderReportCCFactory.GetTraderPerformanceByCC(criteria)
        .success(callback)
        .error(function (xhr) {
            common.HandleAjaxError(xhr);
        })
        .complete(function () {
            common.EnableInput();
        });
    };

    return traderReportCCService;

})(jQuery)