var TraderReportFactory = (function ($) {
    var urls = {
        GetTraderPerformance: common.ResolveRootUrl('OSTraderPerformance/GetTraderPerformance'),
        GetSportsPerformance: common.ResolveRootUrl('OSTraderPerformance/GetSportsPerformanceByTrader'),
        GetAllSports: common.ResolveRootUrl('OSTraderPerformance/GetAllSports'),
    };

    return {
        GetTraderPerformance: function (criteria) {
            return $.get(urls.GetTraderPerformance, criteria);
        },

        GetSportsPerformance: function (criteria) {
            return $.get(urls.GetSportsPerformance, criteria);
        },

        GetAllSports: function () {
            return $.get(urls.GetAllSports);
        }
    }
})(jQuery);
