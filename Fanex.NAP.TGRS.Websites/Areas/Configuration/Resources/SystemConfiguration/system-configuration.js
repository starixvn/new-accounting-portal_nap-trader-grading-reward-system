/* File Created: May 12, 2014 */
/* global Namespace, common, eSchool, labels, messages, scoreCalculationPeriodInfo */
'use strict';

$(document).ready(function () {
    var SystemConfiguration = new eSchool.SystemConfiguration();
    SystemConfiguration.Initialize();

    $("#beginSelectDateOption").on("change", function () {
        SystemConfiguration.beginSelectDateChange();
    });

    $("#beginSelectMonthOption").on("change", function () {
        SystemConfiguration.beginSelectMonthChange();
    });

    $("#endSelectDateOption").on("change", function () {
        SystemConfiguration.endSelectDateChange();
    });

    $("#endSelectMonthOption").on("change", function () {
        SystemConfiguration.endSelectMonthChange();
    });

    $("#selectDateOption").on("change", function () {
        SystemConfiguration.selectedDateChange();
    });

    $("#selectMonthOption").on("change", function () {
        SystemConfiguration.selectedMonthChange();
    });
});

Namespace.Register("eSchool.SystemConfiguration");
eSchool.SystemConfiguration = function () {
    //{ variable-declare
    var $this = this;

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var urls = {
        UpdateDefaultBettype: common.ResolveRootUrl('SystemConfiguration/UpdateDefaultBettype'),
        GetDefaultBettypes: common.ResolveRootUrl('PerformanceDetail/GetDefaultBettypes'),
        UpdateScoreCalculationPeriod: common.ResolveRootUrl('SystemConfiguration/UpdateScoreCalculationPeriod')
    };

    var defaultBettypes = {};

    var updateScoreCalculationPeriodParams = {
        BeginDay: null,
        EndDay: null,
        SelectedDay: null,
        UserId: null
    };

    var domElements = {
        ddlBetType: null,
        btnBettypeFilterSubmit: null,
        divBettypeFilter: null,
        selectDateElement: null,
        beginSelectDateElement: null,
        endSelectDateElement: null,
        selectMonthElement: null,
        beginSelectMonthElement: null,
        endSelectMonthElement: null,
        firstPeriodTime: null,
        secondPeriodTime: null,
        scoreCalculationPeriodSubmit: null
    };
    //}

    //{ DOM-Caching
    var cacheDomElements = function () {
        domElements.ddlBetType = $('#ddlBetType');
        domElements.btnBettypeFilterSubmit = $('#btnBettypeFilterSubmit');
        domElements.divBettypeFilter = $('#divBettypeFilter');
        domElements.selectDateElement = $('#selectDateOption');
        domElements.selectMonthElement = $('#selectMonthOption');
        domElements.beginSelectDateElement = $('#beginSelectDateOption');
        domElements.beginSelectMonthElement = $('#beginSelectMonthOption');
        domElements.endSelectDateElement = $('#endSelectDateOption');
        domElements.endSelectMonthElement = $('#endSelectMonthOption');
        domElements.firstPeriodTime = $('#firstPeriodInfo');
        domElements.secondPeriodTime = $('#seconPeriodInfo');
        domElements.scoreCalculationPeriodSubmit = $('#btnScoreCalculateSubmit');
    };

    //}

    //{ module-init
    $this.Initialize = function () {
        cacheDomElements();
        ajaxGetDefaultBettypes();
        handlePageEvents();
        initScoreCalculationPeriod();
    };
    //}

    //{ page-events & make-form.
    var handlePageEvents = function () {

        domElements.ddlBetType.multiselect({
            selectedList: 2,
            minWidth: 200,
            height: 200,
            allSelectedText: labels.AllBetTypes,
            autoOpen: true,
            beforeclose: function () {
                return false;
            },
            create: function () {
                selectDefaultBettypes(domElements.ddlBetType, defaultBettypes);
            }
        });

        //hide multiselect header
        domElements.divBettypeFilter.find('.ui-multiselect').addClass('hide');
        var multiSelectMenu = $('.ui-multiselect-menu');
        var newtop = multiSelectMenu.position().top - 28;
        multiSelectMenu.css({ top: newtop });

        domElements.btnBettypeFilterSubmit.click(function () {
            ajaxUpdateDefaultBettype();
        });

        domElements.scoreCalculationPeriodSubmit.click(function () {
            var updateParams = getUpdateScoreCalculationPeriodParams();
            common.DisableInput();
            $.ajax({
                type: 'POST',
                url: urls.UpdateScoreCalculationPeriod,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(updateParams),
                success: function (result) {
                    if (result.ErrorCode === 0) {
                        common.ShowInfoMessage("Update successful");
                    } else {
                        common.ShowErrorMessage(result.ErrorMessage);
                        return false;
                    }
                },
                error: function (xhr) {
                    common.HandleAjaxError(xhr);
                },
                complete: function () {
                    common.EnableInput();
                }
            });
        });
    };
    //}


    //{ ajax functions
    var ajaxGetDefaultBettypes = function () {
        common.DisableInput();
        var ajaxResult = false;
        $.ajax({
            type: 'POST',
            url: urls.GetDefaultBettypes,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.DefaultBettypes) {
                    defaultBettypes = result.DefaultBettypes,
                    ajaxResult = true;
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
                ajaxResult = false;
            },
            complete: function () {
                common.EnableInput();
            }
        });
        return ajaxResult;
    };

    //update SystemConfiguration
    var ajaxUpdateDefaultBettype = function () {
        var selectedBetTypes = domElements.ddlBetType.val();
        var bettypes;
        if (selectedBetTypes) {
            bettypes = selectedBetTypes.join(',');
        }
        else {
            bettypes = '';
        }
        var updateParameter = {
            IsDefaultBettypes: bettypes
        };

        common.DisableInput();
        $.ajax({
            type: 'POST',
            url: urls.UpdateDefaultBettype,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({ criteria: updateParameter }),
            success: function (result) {
                if (result.ErrorCode === 0) {
                    common.ShowInfoMessage(messages.UpdateBettypeSuccessfully);
                } else {
                    common.ShowErrorMessage(result.ErrorMessage);
                    return false;
                }
            },
            error: function (xhr) {
                common.HandleAjaxError(xhr);
            },
            complete: function () {
                common.EnableInput();
            }
        });
    };
    //}

    //{ helper functions

    var selectDefaultBettypes = function (selectElemment, selectData) {
        selectElemment.val(selectData);
        selectElemment.multiselect('refresh');
    };

    //{ element-render

    //}

    var initMonths = function (selectElement) {
        for (var i = 0; i < months.length; i++) {
            selectElement.append('<option value="' + (i + 1) + '">' + months[i] + '</option');
        }
    };

    var initDays = function (month, selectElement) {
        var i = 0;
        month = parseInt(month);
        selectElement.empty();
        if (month === 2) {
            for (i = 1; i <= 28; i++) {
                selectElement.append("<option value=" + i + ">" + i + "</option>");
            }
        }
        else if (month === 4 || month === 6 || month === 9 || month === 11) {
            for (i = 1; i <= 30; i++) {
                selectElement.append("<option value=" + i + ">" + i + "</option>");
            }
        }
        else {
            for (i = 1; i <= 31; i++) {
                selectElement.append("<option value=" + i + ">" + i + "</option>");
            }
        }
    };

    var initScoreCalculationPeriod = function () {
        initMonths(domElements.selectMonthElement);
        domElements.selectMonthElement.val(parseInt(scoreCalculationPeriodInfo.selectedMonth));
        initDays(domElements.selectMonthElement.val(), domElements.selectDateElement);
        domElements.selectDateElement.val(parseInt(scoreCalculationPeriodInfo.selectedDate));


        initMonths(domElements.beginSelectMonthElement);
        domElements.beginSelectMonthElement.val(parseInt(scoreCalculationPeriodInfo.beginMonth));
        initDays(domElements.beginSelectMonthElement.val(), domElements.beginSelectDateElement);
        domElements.beginSelectDateElement.val(parseInt(scoreCalculationPeriodInfo.beginDate));


        initMonths(domElements.endSelectMonthElement);
        domElements.endSelectMonthElement.val(parseInt(scoreCalculationPeriodInfo.endMonth));
        initDays(domElements.endSelectMonthElement.val(), domElements.endSelectDateElement);
        domElements.endSelectDateElement.val(parseInt(scoreCalculationPeriodInfo.endDate));

        domElements.selectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.selectMonthElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        domElements.beginSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.beginSelectMonthElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        domElements.endSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.endSelectMonthElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
    };

    $this.beginSelectDateChange = function () {
        var beginDate = parseInt(domElements.beginSelectDateElement.val());
        var beginMonth = parseInt(domElements.beginSelectMonthElement.val());
        var selectedDate = parseInt(domElements.selectDateElement.val());
        var selectedMonth = parseInt(domElements.selectMonthElement.val());
        var endDate = parseInt(domElements.endSelectDateElement.val());
        var endMonth = parseInt(domElements.endSelectMonthElement.val());

        if (beginDate === 1) {
            var endMonthValue = 0;
            var endDateOfMonth = 0;
            if (beginMonth === 1) {
                endMonthValue = 12;
                endDateOfMonth = getEndDateOfMonthValue(endMonthValue);
                domElements.endSelectMonthElement.val(endMonthValue);
                initDays(endMonthValue, domElements.endSelectDateElement);
                domElements.endSelectDateElement.val(endDateOfMonth);
            } else {
                endMonthValue = beginMonth + 12 % 12 - 1;
                endDateOfMonth = getEndDateOfMonthValue(endMonthValue);
                domElements.endSelectMonthElement.val(endMonthValue);
                initDays(endMonthValue, domElements.endSelectDateElement);
                domElements.endSelectDateElement.val(endDateOfMonth);
            }
        } else {
            domElements.endSelectMonthElement.val(beginMonth);
            initDays(beginMonth, domElements.endSelectDateElement);
            domElements.endSelectDateElement.val(beginDate - 1);
        }

        domElements.endSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.endSelectMonthElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        var selectedDateIsEndOfMonth = checkDateIsEndDateOfMonth(selectedDate, selectedMonth);
        var secondPeriodInfo = '';
        domElements.firstPeriodTime.empty();
        domElements.secondPeriodTime.empty();
        endDate = parseInt(domElements.endSelectDateElement.val());
        endMonth = parseInt(domElements.endSelectMonthElement.val());
        var firstPeriodInfo = beginDate + '-' + months[beginMonth - 1] + " to " + selectedDate + '-' + months[selectedMonth - 1];
        if (selectedDateIsEndOfMonth) {
            selectedDate = 1;
            selectedMonth = selectedMonth === 12 ? 0 : selectedMonth;
            secondPeriodInfo = selectedDate + '-' + months[selectedMonth] + " to " + endDate + '-' + months[endMonth - 1];
        } else {
            selectedDate += 1;
            secondPeriodInfo = selectedDate + '-' + months[selectedMonth - 1] + " to " + endDate + '-' + months[endMonth - 1];
        }
        domElements.firstPeriodTime.append(firstPeriodInfo);
        domElements.secondPeriodTime.append(secondPeriodInfo);
    };

    $this.beginSelectMonthChange = function () {
        var beginDate = parseInt(domElements.beginSelectDateElement.val());
        var beginMonth = parseInt(domElements.beginSelectMonthElement.val());
        var maxDateOfMonth = getEndDateOfMonthValue(beginMonth);
        initDays(beginMonth, domElements.beginSelectDateElement);

        if (beginDate < maxDateOfMonth) {
            domElements.beginSelectDateElement.val(beginDate);
        }
        else {
            domElements.beginSelectDateElement.val(1);
        }

        domElements.beginSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        $this.beginSelectDateChange();
    };

    $this.endSelectDateChange = function () {
        var beginDate = parseInt(domElements.beginSelectDateElement.val());
        var beginMonth = parseInt(domElements.beginSelectMonthElement.val());
        var selectedDate = parseInt(domElements.selectDateElement.val());
        var selectedMonth = parseInt(domElements.selectMonthElement.val());
        var endDate = parseInt(domElements.endSelectDateElement.val());
        var endMonth = parseInt(domElements.endSelectMonthElement.val());

        var isEndDateOfMonth = checkDateIsEndDateOfMonth(endDate, endMonth);
        if (isEndDateOfMonth) {
            var beginDateValue = 0;
            var beginMonthValue = 0;
            if (endMonth === 12) {
                beginDateValue = 1;
                beginMonthValue = 1;
                domElements.beginSelectMonthElement.val(beginMonthValue);
                initDays(beginMonthValue, domElements.beginSelectDateElement);
                domElements.beginSelectDateElement.val(beginDateValue);
            } else {
                beginMonthValue = endMonth + 1;
                beginDateValue = 1;
                domElements.beginSelectMonthElement.val(beginMonthValue);
                initDays(beginMonthValue, domElements.beginSelectDateElement);
                domElements.beginSelectDateElement.val(beginDateValue);
            }
        } else {
            domElements.beginSelectMonthElement.val(endMonth);
            initDays(endMonth, domElements.beginSelectDateElement);
            domElements.beginSelectDateElement.val(endDate + 1);
        }

        domElements.beginSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.beginSelectMonthElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        var selectedDateIsEndOfMonth = checkDateIsEndDateOfMonth(selectedDate, selectedMonth);
        var secondPeriodInfo = '';
        domElements.firstPeriodTime.empty();
        domElements.secondPeriodTime.empty();
        beginDate = parseInt(domElements.beginSelectDateElement.val());
        beginMonth = parseInt(domElements.beginSelectMonthElement.val());
        var firstPeriodInfo = beginDate + '-' + months[beginMonth - 1] + " to " + selectedDate + '-' + months[selectedMonth - 1];
        if (selectedDateIsEndOfMonth) {
            selectedDate = 1;
            selectedMonth = selectedMonth === 12 ? 0 : selectedMonth;
            secondPeriodInfo = selectedDate + '-' + months[selectedMonth] + " to " + endDate + '-' + months[endMonth - 1];
        } else {
            selectedDate += 1;
            secondPeriodInfo = selectedDate + '-' + months[selectedMonth - 1] + " to " + endDate + '-' + months[endMonth - 1];
        }
        domElements.firstPeriodTime.append(firstPeriodInfo);
        domElements.secondPeriodTime.append(secondPeriodInfo);
    };

    $this.endSelectMonthChange = function () {
        var endDate = parseInt(domElements.endSelectDateElement.val());
        var endMonth = parseInt(domElements.endSelectMonthElement.val());
        var maxDateOfMonth = getEndDateOfMonthValue(endMonth);
        initDays(endMonth, domElements.endSelectDateElement);

        if (endDate < maxDateOfMonth) {
            domElements.endSelectDateElement.val(endDate);
        }
        else {
            domElements.endSelectDateElement.val(1);
        }

        domElements.endSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        $this.endSelectDateChange();
    };

    $this.selectedDateChange = function () {
        var beginDate = parseInt(domElements.beginSelectDateElement.val());
        var beginMonth = parseInt(domElements.beginSelectMonthElement.val());
        var selectedDate = parseInt(domElements.selectDateElement.val());
        var selectedMonth = parseInt(domElements.selectMonthElement.val());
        var endDate = parseInt(domElements.endSelectDateElement.val());
        var endMonth = parseInt(domElements.endSelectMonthElement.val());

        var selectedDateIsEndOfMonth = checkDateIsEndDateOfMonth(selectedDate, selectedMonth);
        var secondPeriodInfo = '';
        domElements.firstPeriodTime.empty();
        domElements.secondPeriodTime.empty();
        var firstPeriodInfo = beginDate + '-' + months[beginMonth - 1] + " to " + selectedDate + '-' + months[selectedMonth - 1];
        if (selectedDateIsEndOfMonth) {
            selectedDate = 1;
            selectedMonth = selectedMonth === 12 ? 0 : selectedMonth;
            secondPeriodInfo = selectedDate + '-' + months[selectedMonth] + " to " + endDate + '-' + months[endMonth - 1];
        } else {
            selectedDate += 1;
            secondPeriodInfo = selectedDate + '-' + months[selectedMonth - 1] + " to " + endDate + '-' + months[endMonth - 1];
        }
        domElements.firstPeriodTime.append(firstPeriodInfo);
        domElements.secondPeriodTime.append(secondPeriodInfo);
    };

    $this.selectedMonthChange = function () {
        var beginDate = parseInt(domElements.beginSelectDateElement.val());
        var beginMonth = parseInt(domElements.beginSelectMonthElement.val());
        var selectedDate = parseInt(domElements.selectDateElement.val());
        var selectedMonth = parseInt(domElements.selectMonthElement.val());
        var endDate = parseInt(domElements.endSelectDateElement.val());
        var endMonth = parseInt(domElements.endSelectMonthElement.val());

        var maxDateOfMonth = getEndDateOfMonthValue(selectedMonth);
        initDays(selectedMonth, domElements.selectDateElement);
        if (endDate < maxDateOfMonth) {
            domElements.selectDateElement.val(selectedDate);
        }
        else {
            domElements.selectDateElement.val(1);
        }

        domElements.selectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        var selectedDateIsEndOfMonth = checkDateIsEndDateOfMonth(selectedDate, selectedMonth);
        var secondPeriodInfo = '';
        domElements.firstPeriodTime.empty();
        domElements.secondPeriodTime.empty();
        selectedDate = parseInt(domElements.selectDateElement.val());
        selectedMonth = parseInt(domElements.selectMonthElement.val());
        var firstPeriodInfo = beginDate + '-' + months[beginMonth - 1] + " to " + selectedDate + '-' + months[selectedMonth - 1];
        if (selectedDateIsEndOfMonth) {
            selectedDate = 1;
            selectedMonth = selectedMonth === 12 ? 0 : selectedMonth;
            secondPeriodInfo = selectedDate + '-' + months[selectedMonth - 1] + " to " + endDate + '-' + months[endMonth - 1];
        } else {
            selectedDate += 1;
            secondPeriodInfo = selectedDate + '-' + months[selectedMonth - 1] + " to " + endDate + '-' + months[endMonth - 1];
        }
        domElements.firstPeriodTime.append(firstPeriodInfo);
        domElements.secondPeriodTime.append(secondPeriodInfo);
    };

    var checkDateIsEndDateOfMonth = function (date, month) {
        var isEndDateOfMonth = false;
        if (month === 2) {
            isEndDateOfMonth = parseInt(date) === 28;
        }
        else if (month === 4 || month === 6 || month === 9 || month === 11) {
            isEndDateOfMonth = parseInt(date) === 30;
        }
        else {
            isEndDateOfMonth = parseInt(date) === 31;
        }

        return isEndDateOfMonth;
    };

    var getEndDateOfMonthValue = function (month) {
        var endDateOfMonthValue = 0;

        if (month === 2) {
            endDateOfMonthValue = 28;
        }
        else if (month === 4 || month === 6 || month === 9 || month === 11) {
            endDateOfMonthValue = 30;
        }
        else {
            endDateOfMonthValue = 31;
        }

        return endDateOfMonthValue;
    };

    var getUpdateScoreCalculationPeriodParams = function () {
        updateScoreCalculationPeriodParams.BeginDay =
            scoreCalculationPeriodInfo.year + '-' +
            domElements.beginSelectMonthElement.val() + '-' +
            domElements.beginSelectDateElement.val();

        updateScoreCalculationPeriodParams.EndDay =
            scoreCalculationPeriodInfo.year + '-' +
            domElements.endSelectMonthElement.val() + '-' +
            domElements.endSelectDateElement.val();

        updateScoreCalculationPeriodParams.SelectedDay =
            scoreCalculationPeriodInfo.year + '-' +
            domElements.selectMonthElement.val() + '-' +
            domElements.selectDateElement.val();

        return updateScoreCalculationPeriodParams;
    };
};