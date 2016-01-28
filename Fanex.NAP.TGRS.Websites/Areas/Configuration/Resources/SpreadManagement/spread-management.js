/* File Created: Jan 22, 2016 */
/*jshint strict: false, camelcase: false*/
/* global common, validator, messages */

var spreadManagementFactory = (function ($) {
    "use strict";

    return {
        getAllSpread: function (criteria) {
            return $.post(common.ResolveRootUrl('SpreadManagement/GetAllSpread'), criteria);
        },

        updateSpread: function (criteria) {
            return $.post(common.ResolveRootUrl('SpreadManagement/UpdateSpread'), criteria);
        },

        updateSingleSpread: function (criteria) {
            return $.post(common.ResolveRootUrl('SpreadManagement/UpdateSingleSpread'), criteria);
        },

        deleteSpread: function (criteria) {
            return $.post(common.ResolveRootUrl('SpreadManagement/DeleteSpread'), criteria);
        },

        getHostPermission: function () {
            return $.get(common.ResolveRootUrl('SpreadManagement/GetHostPermission'));
        },

        exportSpreadList: function (leagueName) {
            var downloadUrl = common.ResolveRootUrl('SpreadManagement/ExportSpreadList') + "?leagueName=" + leagueName;
            var iframe = $('body iframe');
            if (iframe.length === 0) {
                iframe = $('<iframe width="0" height="0" class="display-none"></iframe>');
                iframe.appendTo('body');
            }

            iframe.attr('src', downloadUrl);
        }
    };

})(jQuery);

var spreadManagementService = (function ($) {
    "use strict";

    var spreadManagementService = {};

    spreadManagementService.result = null;

    spreadManagementService.hasHostPermission = false;

    spreadManagementService.filter = {
        pageIndex: 0,
        pageSize: 50,
        leagueName: ''
    };

    spreadManagementFactory.getHostPermission().success(function (result) {
        spreadManagementService.hasHostPermission = result;
    });

    spreadManagementService.Search = function () {
        $('#PageSize').val(spreadManagementService.filter.pageSize);
        $('#PageIndex').val(spreadManagementService.filter.pageIndex);
        spreadManagementService.filter.leagueName = $('#LeagueName').val();

        var searchParams = {
            LeagueName: spreadManagementService.filter.leagueName,
            PageSize: spreadManagementService.filter.pageSize,
            PageIndex: spreadManagementService.filter.pageIndex + 1
        };

        spreadManagementFactory.getAllSpread(searchParams).success(function (spreadList) {
            renderSpreadTable(spreadList);
        });
    };

    spreadManagementService.ExportExcel = function () {
        spreadManagementService.filter.leagueName = $('#LeagueName').val();

        spreadManagementFactory.exportSpreadList(spreadManagementService.filter.leagueName);
    };

    spreadManagementService.Update = function (leagueId, betTypeId, newSpread) {
        var criteria = {
            LeagueId: leagueId,
            BetTypeId: betTypeId,
            Spread: newSpread
        };

        return spreadManagementFactory.updateSingleSpread(criteria).success(function (result) {
            spreadManagementService.result = result;
        });
    };

    spreadManagementService.Delete = function (leagueId, betTypeId) {
        var criteria = {
            LeagueId: leagueId,
            BetTypeId: betTypeId
        };

        return spreadManagementFactory.deleteSpread(criteria).success(function (result) {
            spreadManagementService.result = result;
        });
    };

    function renderSpreadTable(spreadList) {
        spreadManagementService.gridOptions =
            {
                columns: [
                    { HeaderText: "#", Width: 50, Name: "Row", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "League Name", Width: 350, Name: "LeagueName", HeaderAlign: "center", CellAlign: "left" },
                    { HeaderText: "Bet Type Name", Width: 300, Name: "BetTypeName", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Spread", Width: 50, Name: "Spread", HeaderAlign: "center", CellAlign: "center" },
                    { HeaderText: "Remove", Width: 50, Name: "Delete", HeaderAlign: "center", CellAlign: "center" }
                ],
                bodyRows: createSpreadTable(spreadList.SpreadInfoItems),
                gridExpandHeight: 250,
                showNumberColumn: true,
                showPager: true,
                customPager: true,
                enableHiddenColumns: false,
                hiddenColumns: spreadManagementService.hasHostPermission ? [] : [4],
                pagerOption: {
                    itemsPerPage: spreadManagementService.filter.pageSize,
                    currentPage: spreadManagementService.filter.pageIndex,
                    totalItem: spreadList.TotalItem,
                    itemsPerPageArray: [10, 20, 50, 100, 500],
                    pagerSelectCallBack: reRenderAfterPaged
                }
            };

        $("#divSpreadGrid").fanexGrid(spreadManagementService.gridOptions);

        handleGridEvents();

        $("#resultContainer").css("display: inline-block;");
    }

    function createSpreadTable(spreads) {
        var spreadFormat = '<span class="spread-link link" data-league-id="{0}" data-bettype-id="{1}" >{2}</span>' +
                              '<input type="text" maxlength="2" class="spread hide" />';
        var spreadFormatNoHost = '<span data-league-id="{0}" data-bettype-id="{1}" >{2}</span>';
        var deleteButtonFormat = '<span class="spread-delete-button" data-league-id="{0}" data-bettype-id="{1}" ></span>';

        var rows = [];

        for (var index = 0; index < spreads.length; index++) {
            var spread = spreads[index];
            rows.push({
                Columns: [
                        { Name: "Row", Value: spread.Row },
                        { Name: "LeagueName", Value: spread.LeagueName },
                        { Name: "BetTypeName", Value: spread.BetTypeName },
                        {
                            Name: "Spread", Value: spreadManagementService.hasHostPermission ?
                              spreadFormat.format(spread.LeagueId, spread.BetTypeId, spread.Spread) :
                              spreadFormatNoHost.format(spread.LeagueId, spread.BetTypeId, spread.Spread)
                        },
                        { Name: "Delete", Value: deleteButtonFormat.format(spread.LeagueId, spread.BetTypeId, spread.Spread) }
                ]
            });
        }

        return rows;
    }

    function reRenderAfterPaged(pageIndex, itemsPerPage) {
        if (parseInt(itemsPerPage) !== parseInt($('#PageSize').val())) {
            $('#PageIndex').val(0);
            spreadManagementService.filter.pageIndex = 0;
        } else {
            $('#PageIndex').val(pageIndex);
            spreadManagementService.filter.pageIndex = pageIndex;
        }

        $('#PageSize').val(itemsPerPage);
        spreadManagementService.filter.pageSize = itemsPerPage;

        spreadManagementService.gridOptions.pagerOption.currentPage = pageIndex;
        spreadManagementService.Search();

        return false;
    }

    // Display new team form.
    spreadManagementService.showPopupResult = function (result) {
        var form = $('#divUploadResultForm');
        var option = {};
        common.Popup('Upload Result', form, option);

        spreadPopupResult.renderGrid(result.ErrorSpreads);
        $('#divErrorCount').text(result.ErrorSpreads.length);
        $('#divTotalSpreads').text(result.TotalSpreads);
    };

    var handleGridEvents = function () {
        var spreadLinks = $('#divSpreadGrid').find('span.spread-link');
        var spreadInputs = $('#divSpreadGrid').find('input.spread');
        var spreadDelete = $('#divSpreadGrid').find('span.spread-delete-button');

        // Format the benchmark value which is input into the text box.
        spreadInputs.numberField(2, false);

        // When user clicks on benchmark link.
        spreadLinks.on('click', function () {
            var $link = $(this);
            var $input = $link.next();
            var spread = $link.text();

            // Disable other active fields.
            $.each(spreadLinks, function (index, link) {
                $(link).removeClass('hide').next().addClass('hide').tipsy('hide');
            });

            // Fill current value into text box.
            $link.addClass('hide');
            $input.val(spread).removeClass('hide').focus().select();
        });

        // Handle key up event.
        spreadInputs.on('keyup', function (event) {
            var $input = $(this);
            var $link = $input.prev();
            var newSpread = $input.val();

            if (event.keyCode === 13 && validateSpread($input)) {
                common.ShowConfirmMessage(messages.UpdateSpreadConfirmMessage, function () {
                    var leagueId = $link.attr('data-league-id');
                    var betTypeId = $link.attr('data-bettype-id');

                    spreadManagementService.Update(leagueId, betTypeId, newSpread).then(function () {
                        if (spreadManagementService.result.IsSuccessful) {

                            common.ShowInfoMessage(messages.UpdateSpreadSuccessfully);

                            $link.text(newSpread);
                            $input.addClass('hide');
                            $link.removeClass('hide');
                            $input.tipsy('hide');
                        } else {
                            common.ShowErrorMessage(spreadManagementService.result.Message);
                        }
                    });
                });
            } else if (event.keyCode === 27) {
                $input.addClass('hide');
                $link.removeClass('hide');
                $input.tipsy('hide');
            }
        });

        // Handle delete event.
        spreadDelete.on('click', function () {
            var $link = $(this);

            common.ShowConfirmMessage(messages.DeleteSpreadConfirmMessage, function () {
                var leagueId = $link.attr('data-league-id');
                var betTypeId = $link.attr('data-bettype-id');

                spreadManagementService.Delete(leagueId, betTypeId).then(function () {
                    if (spreadManagementService.result.IsSuccessful) {
                        common.ShowInfoMessage(messages.DeleteSpreadSuccessfully);

                        spreadManagementService.filter.pageSize = 50;
                        spreadManagementService.filter.pageIndex = 0;
                        spreadManagementService.Search();
                    } else {
                        common.ShowErrorMessage(spreadManagementService.result.Message);
                    }
                });
            });
        });
    };

    var validateSpread = function ($input) {
        var value = $input.val().replace(/,/g, '');
        var isValid = $.isNumeric(value);

        if (isValid) {
            value = parseFloat(value);
            isValid = 0 < value && value <= 100;
        }

        if (!isValid) {
            validator.ShowError($input, messages.InvalidValueError, 'e');
        }

        return isValid;
    };

    return spreadManagementService;
})(jQuery);

$(document).ready(function () {

    $("#btnSearchSpread").on('click', function () {
        spreadManagementService.filter.pageSize = 50;
        spreadManagementService.filter.pageIndex = 0;

        spreadManagementService.Search();
    });

    $("#excelBtn").on('click', function () {
        spreadManagementService.ExportExcel();
    });

    $("#browseBtn").click(function () {
        $("#file").click();
    });

    $("#file").change(function () {
        $("#fileName").val($("#file").val());
    });

    $("#uploadBtn").click(function () {
        var data = new FormData();
        var file = document.getElementById("file").files[0];
        data.append("file", file);
        if (file == undefined) {
            alert(messages.MissingExcelFile);
        }
        else {
            common.DisableInput();
            $.ajax({
                url: common.ResolveRootUrl("SpreadManagement/PopupResult"),
                type: "POST",
                data: data,
                processData: false,
                contentType: false,
                success: function (result) {
                    spreadManagementService.showPopupResult(result);
                },
                complete: function () {
                    common.EnableInput();
                }
            });
        }
    });
});
