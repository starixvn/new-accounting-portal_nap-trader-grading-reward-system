/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, epaManagementFactory */

var epaManagementService = (function ($) {
    var epaManagementService = {};


    epaManagementService.GetEPADeductionReport = function (callback) {
        common.DisableInput();
        return epaManagementFactory.GetEPADeductionReport()
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

    epaManagementService.GetEPADeductionHistory = function (callback) {
        common.DisableInput();
        return epaManagementFactory.GetEPADeductionHistory()
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

    epaManagementService.DeleteEPADeductionHistory = function (error) {
        common.DisableInput();
        return errorManagementFactory.DeleteEPADeductionHistory(error)
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

    epaManagementService.GetErrorHistory = function (callback) {
        common.DisableInput();
        return epaManagementFactory.GetErrorHistory()
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

    epaManagementService.DeleteErrorHistory = function (error) {
        common.DisableInput();
        return errorManagementFactory.DeleteErrorHistory(error)
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

    epaManagementService.GetLeaveHistory = function (callback) {
        common.DisableInput();
        return epaManagementFactory.GetLeaveHistory()
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

    epaManagementService.DeleteLeaveHistory = function (error) {
        common.DisableInput();
        return errorManagementFactory.DeleteLeaveHistory(error)
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

    epaManagementService.GetErrorTypes = function (callback) {
        return epaManagementFactory.GetErrorTypes()
            .success(function (result) {
                callback(result);
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };
    

    epaManagementService.InsertEPADeduction = function (error, callback) {
        common.DisableInput();
        return errorManagementFactory.InsertEPADeduction(error)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    epaManagementService.InsertError = function (error, callback) {
        common.DisableInput();
        return errorManagementFactory.InsertError(error)
            .success(callback)
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    epaManagementService.InsertLeave = function (error, callback) {
        common.DisableInput();
        return errorManagementFactory.InsertLeave(error)
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
