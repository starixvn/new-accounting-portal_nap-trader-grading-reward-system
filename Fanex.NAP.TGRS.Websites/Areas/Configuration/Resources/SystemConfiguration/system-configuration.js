/* File Created: May 12, 2014 */
/*jshint strict: false*/
/* global Namespace, common, eSchool, labels, messages, scoreCalculationPeriodInfo */
////'use strict';

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

    $("#firstSelectDateOption").on("change", function () {
        SystemConfiguration.firstSelectedDateChange();
    });

    $("#firstSelectMonthOption").on("change", function () {
        SystemConfiguration.firstSelectedMonthChange();
    });

    $("#secondSelectDateOption").on("change", function () {
        SystemConfiguration.secondSelectedDateChange();
    });

    $("#secondSelectMonthOption").on("change", function () {
        SystemConfiguration.secondSelectedMonthChange();
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
        beginSelectDateElement: null,
        firstSelectDateElement: null,
        secondSelectDateElement: null,
        endSelectDateElement: null,
        beginSelectMonthElement: null,
        firstSelectMonthElement: null,
        secondSelectMonthElement: null,
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
        domElements.firstSelectDateElement = $('#firstSelectDateOption');
        domElements.firstSelectMonthElement = $('#firstSelectMonthOption');
        domElements.secondSelectDateElement = $('#secondSelectDateOption');
        domElements.secondSelectMonthElement = $('#secondSelectMonthOption');
        domElements.beginSelectDateElement = $('#beginSelectDateOption');
        domElements.beginSelectMonthElement = $('#beginSelectMonthOption');
        domElements.endSelectDateElement = $('#endSelectDateOption');
        domElements.endSelectMonthElement = $('#endSelectMonthOption');
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
        var selectedDate = parseInt(scoreCalculationPeriodInfo.selectedDate);
        var selectedMonth = parseInt(scoreCalculationPeriodInfo.selectedMonth);
        initMonths(domElements.firstSelectMonthElement);
        domElements.firstSelectMonthElement.val(selectedMonth);
        initDays(domElements.firstSelectMonthElement.val(), domElements.firstSelectDateElement);
        domElements.firstSelectDateElement.val(selectedDate);

        var isEndDayOfMonth = checkDateIsEndDateOfMonth(selectedDate, selectedMonth);
        if (isEndDayOfMonth) {
            selectedDate = 1;
            selectedMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
        }
        else {
            selectedDate += 1;
        }
        initMonths(domElements.secondSelectMonthElement);
        domElements.secondSelectMonthElement.val(selectedMonth);
        initDays(domElements.secondSelectMonthElement.val(), domElements.secondSelectDateElement);
        domElements.secondSelectDateElement.val(selectedDate);

        initMonths(domElements.beginSelectMonthElement);
        domElements.beginSelectMonthElement.val(parseInt(scoreCalculationPeriodInfo.beginMonth));
        initDays(domElements.beginSelectMonthElement.val(), domElements.beginSelectDateElement);
        domElements.beginSelectDateElement.val(parseInt(scoreCalculationPeriodInfo.beginDate));


        initMonths(domElements.endSelectMonthElement);
        domElements.endSelectMonthElement.val(parseInt(scoreCalculationPeriodInfo.endMonth));
        initDays(domElements.endSelectMonthElement.val(), domElements.endSelectDateElement);
        domElements.endSelectDateElement.val(parseInt(scoreCalculationPeriodInfo.endDate));

        domElements.firstSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.firstSelectMonthElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        domElements.secondSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.secondSelectMonthElement.multiselect({
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

    $this.firstSelectedDateChange = function () {
        var firstSelectedDate = parseInt(domElements.firstSelectDateElement.val());
        var firstSelectedMonth = parseInt(domElements.firstSelectMonthElement.val());

        var secondSelectedDate = 0;
        var secondSelectedMonth = 0;
        var isEndDateOfMonth = checkDateIsEndDateOfMonth(firstSelectedDate, firstSelectedMonth);
        if (isEndDateOfMonth) {
            secondSelectedDate = 1;
            secondSelectedMonth = firstSelectedMonth === 12 ? 1 : firstSelectedMonth + 1;
        } else {
            secondSelectedDate = firstSelectedDate + 1;
            secondSelectedMonth = firstSelectedMonth;
        }

        initDays(secondSelectedMonth, domElements.secondSelectDateElement);
        domElements.secondSelectDateElement.val(secondSelectedDate);
        domElements.secondSelectMonthElement.val(secondSelectedMonth);

        domElements.secondSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.secondSelectMonthElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
    };

    $this.firstSelectedMonthChange = function () {
        var firstSelectedDate = parseInt(domElements.firstSelectDateElement.val());
        var firstSelectedMonth = parseInt(domElements.firstSelectMonthElement.val());

        var maxDateOfMonth = getEndDateOfMonthValue(firstSelectedMonth);
        initDays(firstSelectedMonth, domElements.firstSelectDateElement);
        firstSelectedDate = firstSelectedDate <= maxDateOfMonth ? firstSelectedDate : 1;
        domElements.firstSelectDateElement.val(firstSelectedDate);
        domElements.firstSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        $this.firstSelectedDateChange();
    };

    $this.secondSelectedDateChange = function () {
        var secondSelectedDate = parseInt(domElements.secondSelectDateElement.val());
        var secondSelectedMonth = parseInt(domElements.secondSelectMonthElement.val());

        var firstSelectedDate = 0;
        var firstSelectedMonth = 0;
        if (secondSelectedDate === 1) {
            firstSelectedMonth = secondSelectedMonth === 1 ? 12 : secondSelectedMonth - 1;
            firstSelectedDate = getEndDateOfMonthValue(firstSelectedMonth);
        } else {
            firstSelectedDate = secondSelectedDate - 1;
            firstSelectedMonth = secondSelectedMonth;
        }

        initDays(firstSelectedMonth, domElements.firstSelectDateElement);
        domElements.firstSelectDateElement.val(firstSelectedDate);
        domElements.firstSelectMonthElement.val(firstSelectedMonth);

        domElements.firstSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
        domElements.firstSelectMonthElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });
    };

    $this.secondSelectedMonthChange = function () {
        var secondSelectedDate = parseInt(domElements.secondSelectDateElement.val());
        var secondSelectedMonth = parseInt(domElements.secondSelectMonthElement.val());

        var maxDateOfMonth = getEndDateOfMonthValue(secondSelectedMonth);
        initDays(secondSelectedMonth, domElements.secondSelectDateElement);
        secondSelectedDate = secondSelectedDate <= maxDateOfMonth ? secondSelectedDate : 1;
        domElements.secondSelectDateElement.val(secondSelectedDate);
        domElements.secondSelectDateElement.multiselect({
            selectedList: 1,
            minWidth: 40,
            height: 200,
            header: false,
            multiple: false
        });

        $this.secondSelectedDateChange();
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
            domElements.firstSelectMonthElement.val() + '-' +
            domElements.firstSelectDateElement.val();

        return updateScoreCalculationPeriodParams;
    };
};