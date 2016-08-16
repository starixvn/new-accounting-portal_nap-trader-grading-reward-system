var TraderReportFactory = (function ($) {
    var urls = {
        GetTraderPerformance: common.ResolveRootUrl('OSTraderPerformance/GetTraderPerformance'),
        GetSportsPerformance: common.ResolveRootUrl('OSTraderPerformance/GetSportsPerformanceByTrader')
    };

    return {
        GetTraderPerformance: function (criteria) {
            return $.get(urls.GetTraderPerformance, criteria);
        },

        GetSportsPerformance: function (criteria) {
            return $.get(urls.GetSportsPerformance, criteria);
        }
    }
})(jQuery);
