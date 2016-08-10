var OSSettingFactory = (function ($) {
    var urls = {
        UpdateGlobalTarget: common.ResolveRootUrl("OSSetting/UpdateGlobalTarget"),
        AddNewTarget: common.ResolveRootUrl("OSSetting/AddNewTarget"),
        SportSuggestion: common.ResolveRootUrl("OSSetting/SuggestSport"),
        LeagueSuggestion: common.ResolveRootUrl("OSSetting/SuggestLeague"),
        GetTarget: common.ResolveRootUrl("OSSetting/GetTarget")
    }

    return {
        UpdateGlobalTarget: function (criteria) {
            return $.post(urls.UpdateGlobalTarget, criteria);
        },
        AddNewTarget: function (criteria) {
            return $.post(urls.AddNewTarget, criteria);
        },
        SuggestSport: function (criteria) {
            return $.get(urls.SportSuggestion, criteria);
        },
        SuggestLeague: function (criteria) {
            return $.get(urls.LeagueSuggestion, criteria);
        },
        GetTarget: function () {
            return $.get(urls.GetTarget);
        }
    }
})(jQuery);