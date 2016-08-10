var OSSettingService = (function ($) {
    return {
        UpdateGlobalTarget: function (criteria, callback) {
            OSSettingFactory.UpdateGlobalTarget(criteria)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        },

        SuggestSport: function (criteria, callback) {
            OSSettingFactory.SuggestSport(criteria)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        },

        SuggestLeague: function (criteria, callback) {
            OSSettingFactory.SuggestLeague(criteria)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        },

        GetTarget: function (callback) {
            OSSettingFactory.GetTarget()
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        }
    }
})(jQuery);