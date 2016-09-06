/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global common, labels, hasEditRight, validator, messages, epaManagementFactory */

var epaManagementService = (function ($) {
    var epaManagementService = {};
    epaManagementService.EPADeductionList = [];
    epaManagementService.EPADeductionHistoryList = [];
    epaManagementService.ErrorHistoryList = [];
    epaManagementService.LeaveHistoryList = [];

    epaManagementService.GetEPADeductionReport = function (criteria) {
        common.DisableInput();
        return epaManagementFactory.GetEPADeductionReport(criteria)
            .success(function (result) {
                epaManagementService.EPADeductionList = result;
            })
            .error(function (xhr) {
                common.HandleAjaxError(xhr);
            })
            .complete(function () {
                common.EnableInput();
            });
    };

    epaManagementService.GetEPADeductionHistory = function (criteria) {
        common.DisableInput();
        return epaManagementFactory.GetEPADeductionHistory(criteria)
            .success(function (result) {
                epaManagementService.EPADeductionHistoryList = result;
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

    epaManagementService.GetErrorHistory = function (criteria) {
        common.DisableInput();
        return epaManagementFactory.GetErrorHistory(criteria)
            .success(function (result) {
                epaManagementService.ErrorHistoryList = result;
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

    epaManagementService.GetLeaveHistory = function (criteria) {
        common.DisableInput();
        return epaManagementFactory.GetLeaveHistory(criteria)
            .success(function (result) {
                epaManagementService.LeaveHistoryList = result;
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


    epaManagementService.InsertEPADeduction = function (deduction, callback) {
        common.DisableInput();
        return errorManagementFactory.InsertEPADeduction(deduction)
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

    epaManagementService.InsertLeave = function (leave, callback) {
        common.DisableInput();
        return errorManagementFactory.InsertLeave(leave)
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
