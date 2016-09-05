/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global  common */

var epaManagementFactory = (function ($) {
    var urls = {
        GetAllErrors: common.ResolveRootUrl('OSErrorManagement/GetAllErrors'),
        InsertError: common.ResolveRootUrl('OSErrorManagement/InsertError'),
        UpdateError: common.ResolveRootUrl('OSErrorManagement/UpdateError'),
        UpdateErrorStatus: common.ResolveRootUrl('OSErrorManagement/UpdateErrorStatus'),
        DeleteError: common.ResolveRootUrl('OSErrorManagement/DeleteError')
    };

    return {
        GetAllEPAs: function () {
            return $.get(urls.GetAllErrors);
        },

        InsertError: function (error) {
            return $.post(urls.InsertError, error);
        },

        UpdateError: function (error) {
            return $.post(urls.UpdateError, error);
        },

        UpdateErrorStatus: function (error) {
            return $.post(urls.UpdateErrorStatus, error);
        },

        DeleteError: function (error) {
            return $.post(urls.DeleteError, error);
        }
    }
})(jQuery);
