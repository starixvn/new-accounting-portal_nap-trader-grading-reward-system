var TraderReportCCFactory = (function ($) {
    var urls = {
        GetTraderPerformanceByCC: common.ResolveRootUrl('OSTraderPerformanceByCC/GetTraderPerformanceByCC')
    };

    return {
        GetTraderPerformanceByCC: function (criteria) {
            return $.get(urls.GetTraderPerformanceByCC, criteria);
        },
    }
})(jQuery);
