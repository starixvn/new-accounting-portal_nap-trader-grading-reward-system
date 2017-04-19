var TraderReportFactory = (function ($) {
    var urls = {
        GetTraderPerformance: common.ResolveRootUrl('OSTraderPerformance/GetTraderPerformance'),
        GetSportsPerformance: common.ResolveRootUrl('OSTraderPerformance/GetSportsPerformanceByTrader'),
        GetRegionsPerformance: common.ResolveRootUrl('OSTraderPerformance/GetRegionsPerformanceByTrader'),
        GetAllSports: common.ResolveRootUrl('OSTraderPerformance/GetAllSports'),
        GetLeaguePerformance: common.ResolveRootUrl('OSTraderPerformance/GetLeaguePerformance'),
        GetBettypePerformance: common.ResolveRootUrl('OSTraderPerformance/GetBettypePerformance')
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
        },

        GetLeaguePerformance: function (criteria) {
            return $.get(urls.GetLeaguePerformance, criteria);
        },

        GetBettypePerformance: function (criteria) {
            return $.get(urls.GetBettypePerformance, criteria);
        }
    }
})(jQuery);
