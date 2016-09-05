/* File Created: Jul 26, 2016 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, errorManagementService */
////'use strict';

$(document).ready(function () {
    epaManagement.Initialize();
});

var epaManagement = (function ($) {
    var epaManagement = {};

    var timeout = null;
    var domElements = {
        EPAGrid: null,
        lnkAddNewError: null,
        divInsertErrorForm: null,
        divUpdateErrorForm: null,
        divPopup: null
    };

    function normalizeString(str) {
        return str == null || str.length == 0 ? "-" : str;
    }

    epaManagement.GetAllEPAs = function () {
        epaManagementService.GetAllEPAs(renderGrid);
    };

    epaManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        epaManagement.GetAllEPAs();
    };

    var cacheDOMElements = function () {
        domElements.EPAGrid = $('#divEPAGrid');
        domElements.lnkAddNewError = $('#newErrLink');
        domElements.divInsertErrorForm = $('#divInsertErrorForm').clone();
        domElements.divUpdateErrorForm = $('#divUpdateErrorForm').clone();

        $('#divHiddenForm').empty();
    };

    function renderGrid(data) {
        var addIssueFormat = '<div class="add-issue-link" data-trader-id="{0}" href="#" data-trader-name="{1}"></div>';
        var linkFormat = '<span class="{0} link" data-trader-id="{1}" data-trader-name="{3}">{2}</span>';
        var mapper = function (item, idx) {
            return {
                Columns: [{ Name: 'ColNum', Value: idx + 1 },
                            { Name: 'ColName', Value: item.TraderName },
                            { Name: 'ColEPA', Value: item.EPADeduction == 0 ? 0 : linkFormat.format("get-epa-link", item.TraderId, item.EPADeduction, item.TraderName) },
                            { Name: 'ColError', Value: item.Error == 0 ? 0 : linkFormat.format("get-error-link", item.TraderId, item.Error, item.TraderName) },
                            { Name: 'ColLeave', Value: item.Error == 0 ? 0 : linkFormat.format("get-leave-link", item.TraderId, item.EmergencyLeave, item.TraderName) },
                            { Name: 'ColErrorInsert', Value: addIssueFormat.format(item.TraderId, item.TraderName), CssClass: 'add-issue' }
                ]
            }
        }

        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Username", Width: 200, Name: 'ColName', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "EPA P.Deduction", Width: 100, Name: 'ColEPA', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "Error", Width: 40, Name: 'ColError', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "E.Leave", Width: 50, Name: 'ColLeave', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "", Width: 50, Name: 'ColErrorInsert', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            gridExpandHeight: 100,
            bodyRows: data.map(mapper)
        };

        domElements.EPAGrid.fanexGrid(gridOptions);
    }

    function addIssue(traderId) {
        alert(traderId);
    }

    var handlePageEvents = function () {
        domElements.EPAGrid.on("click", "div.add-issue", function () {
            var $this = $(this).children().first();
            var traderId = $this.attr("data-trader-id");

            addIssue(traderId);
        });
    };

    var refreshPopup = function () {
        clearTimeout(timeout);
        common.CloseMsgBox();
    };

    return epaManagement;
})(jQuery);