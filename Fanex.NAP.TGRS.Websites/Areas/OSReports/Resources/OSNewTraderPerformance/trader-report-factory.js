var TraderReportFactory = (function ($) {
    var urls = {
        GetTraderPerformance: common.ResolveRootUrl('OSNewTraderPerformance/GetTraderPerformance'),
        GetSportsPerformance: common.ResolveRootUrl('OSNewTraderPerformance/GetSportsPerformanceByTrader'),
        GetRegionsPerformance: common.ResolveRootUrl('OSNewTraderPerformance/GetRegionsPerformanceByTrader'),
        GetAllSports: common.ResolveRootUrl('OSNewTraderPerformance/GetAllSports'),
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
        },

        GetRegionsPerformance: function (criteria) {
            return $.get(urls.GetRegionsPerformance, criteria);
        }
    }
})(jQuery);
