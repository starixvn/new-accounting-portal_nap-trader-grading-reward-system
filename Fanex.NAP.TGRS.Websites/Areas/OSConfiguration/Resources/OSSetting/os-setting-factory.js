var OSSettingFactory = (function ($) {
    var urls = {
        GetSettings: common.ResolveRootUrl("OSSetting/GetSettings"),
        UpdateTarget: common.ResolveRootUrl("OSSetting/UpdateTarget"),
        AddSetting: common.ResolveRootUrl("OSSetting/AddSetting"),
        UpdateSetting: common.ResolveRootUrl("OSSetting/UpdateSetting"),
        DeleteSetting: common.ResolveRootUrl("OSSetting/DeleteSetting"),
        GetSports: common.ResolveRootUrl("OSSetting/GetSports"),
        GetLeagues: common.ResolveRootUrl("OSSetting/GetLeagues"),
        GetBettypes: common.ResolveRootUrl("OSSetting/GetBettypes"),
        GetParameters: common.ResolveRootUrl("OSSetting/GetParameters"),
        UpdateParameters: common.ResolveRootUrl("OSSetting/UpdateParameters")
    }

    return {
        GetSettings: function () {
            return $.get(urls.GetSettings);
        },

        UpdateTarget: function (criteria) {
            return $.post(urls.UpdateTarget, criteria);
        },


        AddSetting: function (criteria) {
            return $.post(urls.AddSetting, criteria);
        },

        UpdateSetting: function (criteria) {
            return $.post(urls.UpdateSetting, criteria);
        },

        DeleteSetting: function (criteria) {
            return $.post(urls.DeleteSetting, criteria);
        },

        GetSports: function () {
            return $.get(urls.GetSports);
        },

        GetLeagues: function (criteria) {
            return $.get(urls.GetLeagues, criteria);
        },

        GetBettypes: function () {
            return $.get(urls.GetBettypes);
        },

        GetParameters: function () {
            return $.get(urls.GetParameters);
        },

        UpdateParameters: function (criteria) {
            return $.post(urls.UpdateParameters, criteria);
        }
    }
})(jQuery);