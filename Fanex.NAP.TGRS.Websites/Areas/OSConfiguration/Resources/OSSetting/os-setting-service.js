var OSSettingService = (function ($) {
    return {
        GetSettings: function (callback) {
            OSSettingFactory.GetSettings().
                success(callback)
                .error(function (xhr) {
                    common.HandleAjaxError(xhr);
                })
                .complete(function () {
                    common.EnableInput();
                });
        },

        UpdateTarget: function (criteria, callback) {
            OSSettingFactory.UpdateTarget(criteria).
                success(callback)
                .error(function (xhr) {
                    common.HandleAjaxError(xhr);
                })
                .complete(function () {
                    common.EnableInput();
                });
        },


        AddSetting: function (criteria, callback) {
            OSSettingFactory.AddSetting(criteria).
                success(callback)
                .error(function (xhr) {
                    common.HandleAjaxError(xhr);
                })
                .complete(function () {
                    common.EnableInput();
                });
        },

        UpdateSetting: function (criteria, callback) {
            OSSettingFactory.UpdateSetting(criteria).
                success(callback)
                .error(function (xhr) {
                    common.HandleAjaxError(xhr);
                })
                .complete(function () {
                    common.EnableInput();
                });
        },

        DeleteSetting: function (criteria, callback) {
            OSSettingFactory.DeleteSetting(criteria).
                success(callback)
                .error(function (xhr) {
                    common.HandleAjaxError(xhr);
                })
                .complete(function () {
                    common.EnableInput();
                });
        },

        GetSports: function (callback) {
            OSSettingFactory.GetSports().
                success(callback)
                .error(function (xhr) {
                    common.HandleAjaxError(xhr);
                })
                .complete(function () {
                    common.EnableInput();
                });
        },

        GetLeagues: function (criteria, callback) {
            OSSettingFactory.GetLeagues(criteria).
                success(callback)
                .error(function (xhr) {
                    common.HandleAjaxError(xhr);
                })
                .complete(function () {
                    common.EnableInput();
                });
        },

        GetBettypes: function (callback) {
            OSSettingFactory.GetBettypes().
                success(callback)
                .error(function (xhr) {
                    common.HandleAjaxError(xhr);
                })
                .complete(function () {
                    common.EnableInput();
                });
        },

        GetParameters: function (callback) {
            OSSettingFactory.GetParameters().
            success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        },

        UpdateParameters: function (criteria, callback) {
            OSSettingFactory.UpdateParameters(criteria).
            success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
        }
    }
})(jQuery);