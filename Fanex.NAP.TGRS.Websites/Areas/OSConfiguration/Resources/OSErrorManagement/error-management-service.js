/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, errorManagementFactory */

var errorManagementService = (function ($) {
    var errorManagementService = {};
    errorManagementService.Errors = [];
    errorManagementService.Result = [];

    errorManagementService.GetAllErrors = function () {
        common.DisableInput();
        return errorManagementFactory.GetAllErrors()
            .success(function (result) {
                errorManagementService.Errors = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    errorManagementService.InsertError = function (error) {
        common.DisableInput();
        return errorManagementFactory.InsertError(error)
            .success(function (result) {
                errorManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    errorManagementService.UpdateError = function (error) {
        common.DisableInput();
        return errorManagementFactory.UpdateError(error)
            .success(function (result) {
                errorManagementService.Result = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    errorManagementService.UpdateErrorStatus = function (error, callback) {
        common.DisableInput();
        return errorManagementFactory.UpdateErrorStatus(error)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    errorManagementService.DeleteError = function (error, callback) {
        common.DisableInput();
        return errorManagementFactory.DeleteError(error)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    return errorManagementService;
})(jQuery);
