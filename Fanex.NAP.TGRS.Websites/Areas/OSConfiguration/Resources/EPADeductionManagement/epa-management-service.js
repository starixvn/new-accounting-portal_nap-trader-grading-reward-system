/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, errorManagementFactory */

var epaManagementService = (function ($) {
    var epaManagementService = {};


    epaManagementService.GetAllEPAs = function (callback) {
        common.DisableInput();
        return epaManagementFactory.GetAllEPAs()
            .success(function () {
                var data = [{ TraderName: "adfadf", EPADeduction: 8, Error: 10, EmergencyLeave: 25, TraderId: 8 }];
                callback(data);
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    epaManagementService.InsertError = function (error) {
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

    epaManagementService.UpdateError = function (error) {
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

    epaManagementService.UpdateErrorStatus = function (error, callback) {
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

    epaManagementService.DeleteError = function (error, callback) {
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

    return epaManagementService;
})(jQuery);
