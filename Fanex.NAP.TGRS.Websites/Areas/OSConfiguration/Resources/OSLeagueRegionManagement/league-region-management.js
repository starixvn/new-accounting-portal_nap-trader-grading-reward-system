/* File Created: Feb 17, 2017 */
/*jshint strict: false*/
/* global Namespace, common, labels, hasEditRight, validator, messages, leagueRegionManagementService */
////'use strict';

$(document).ready(function () {
    leagueRegionManagement.Initialize();
});

var leagueRegionManagement = (function ($) {
    var leagueRegionManagement = {};
    leagueRegionManagement.LeagueRegions = leagueRegionManagementService.LeagueRegions;
    leagueRegionManagement.Sports = leagueRegionManagementService.Sports;
    leagueRegionManagement.Regions = leagueRegionManagementService.Regions;
    leagueRegionManagement.Result = leagueRegionManagementService.Result;

    leagueRegionManagement.pagingManual = {
        pageIndex: 0,
        itemsPerPage: common.Constants.PageSize
    };

    var domElements = {
        divLeagueRegionsGrid: null,
        lnkAddNewLeagueRegion: null,
        sportSelector: null,
        regionSelector: null,
        leagueRegionFilterForm: null
    };

    leagueRegionManagement.GetSports = function () {
        leagueRegionManagementService.GetSports().then(function () {
            leagueRegionManagement.Sports = leagueRegionManagementService.Sports;

            leagueRegionManagement.AddSports(leagueRegionManagement.Sports, domElements.sportSelector);
        });
    };

    leagueRegionManagement.GetRegions = function () {
        leagueRegionManagementService.GetRegions().then(function (result) {
            leagueRegionManagement.Regions = leagueRegionManagementService.Regions;

            leagueRegionManagement.AddRegions(leagueRegionManagement.Regions, domElements.regionSelector);
        });
    };

    leagueRegionManagement.GetLeagueRegions = function () {
        common.DisableInput();

        var leagueName = $("#txtLeagueName", domElements.leagueRegionFilterForm).val();
        var sportId = $("#ddlSport", domElements.leagueRegionFilterForm).find(":selected").attr("sport-id");
        var regionId = $("#ddlRegion", domElements.leagueRegionFilterForm).find(":selected").attr("region-id");

        if (leagueName === null || leagueName === undefined) {
            leagueName = "";
        }

        if (sportId === null || sportId === undefined) {
            sportId = 2;
        }

        if (regionId === null || regionId === undefined) {
            regionId = -1;
        }

        var criteria = {
            LeagueName: leagueName,
            SportId: sportId,
            RegionId: regionId
        };

        leagueRegionManagementService.GetLeagueRegions(criteria).then(function () {
            leagueRegionManagement.LeagueRegions = leagueRegionManagementService.LeagueRegions;
            leagueRegionManagement.pagingManual.pageIndex = 0;
            leagueRegionManagement.pagingManual.itemsPerPage = common.Constants.PageSize;

            renderGrid(leagueRegionManagement.LeagueRegions.slice(leagueRegionManagement.pagingManual.pageIndex * leagueRegionManagement.pagingManual.itemsPerPage,
            leagueRegionManagement.pagingManual.itemsPerPage * (leagueRegionManagement.pagingManual.pageIndex + 1)));
        });
    };

    leagueRegionManagement.AddSports = function (data, selector) {
        for (var i = 0; i < data.length; i++) {
            var option = $("<option></option>").attr("sport-id", data[i].SportId).text(data[i].SportName);
            selector.append(option);
        }
    };

    leagueRegionManagement.AddRegions = function (data, selector) {
        for (var i = 0; i < data.length; i++) {
            var option = $("<option></option>").attr("region-id", data[i].RegionId).text(data[i].RegionName);
            selector.append(option);
        }
    };

    leagueRegionManagement.Initialize = function () {
        cacheDOMElements();
        handlePageEvents();
        leagueRegionManagement.GetSports();
        leagueRegionManagement.GetRegions();
        leagueRegionManagement.GetLeagueRegions();
    };

    var cacheDOMElements = function () {
        domElements.divLeagueRegionsGrid = $('#divLeagueRegionsGrid');
        domElements.sportSelector = $("#ddlSport");
        domElements.regionSelector = $("#ddlRegion");
        domElements.leagueRegionFilterForm = $("#divLeagueRegionFilterForm");
    };

    var renderGrid = function (data) {
        var linkFormat = '<span class="{0} link" data-league-id="{1}" data-region-id="{2}">{3}</span>';
        var gridOptions = {
            columns: [{ HeaderText: '#', Width: 40, Name: 'ColNum', HeaderAlign: 'center', CellAlign: 'center' },
                      { HeaderText: "League", Width: 500, Name: 'ColLeague', HeaderAlign: 'center', CellAlign: 'left' },
                      { HeaderText: "Region", Width: 200, Name: 'ColRegion', HeaderAlign: 'center', CellAlign: 'left' }],
            showNumberColumn: true,
            gridExpandHeight: 180,
            showPager: true,
            customPager: true,
            pagerOption: {
                currentPage: leagueRegionManagement.pagingManual.pageIndex,
                itemsPerPage: leagueRegionManagement.pagingManual.itemsPerPage,
                totalItem: leagueRegionManagement.LeagueRegions.length,
                itemsPerPageArray: common.Constants.PagerRanges,
                pagerSelectCallBack: reRenderAfterPaged
            }
        };

        var bodyData = [];
        var row;

        if (data && data.length > 0) {
            $.each(data, function (index, item) {
                row = {
                    Columns: [{ Name: 'ColNum', Value: index + 1 },
                              { Name: 'ColLeague', Value: item.LeagueName },
                              { Name: 'ColRegion', Value: hasEditRight ? linkFormat.format("get-region-link", item.LeagueId, item.RegionId, item.RegionId > 0 ? item.RegionName : "-") : item.RegionName }
                    ]
                };

                bodyData.push(row);
            });
        }
        gridOptions.bodyRows = bodyData;
        domElements.divLeagueRegionsGrid.fanexGrid(gridOptions);
    };

    var handlePageEvents = function () {
        domElements.divLeagueRegionsGrid.on('click', 'span.get-region-link', function () {
            var el = $(this);
            var selector = $('<select style="width: 100%;" id="add-region-link"></select>');
            var leagueId = el.attr('data-league-id');
            var regionId = el.attr('data-region-id');

            el.hide();

            el.parent().remove('select#add-region-link');

            var data = leagueRegionManagement.Regions;

            selector.append($("<option></option>").attr("region-id", -1).text('-'));

            for (var i = 0; i < data.length; i++) {
                var option = $("<option></option>").attr("region-id", data[i].RegionId).text(data[i].RegionName);
                if (data[i].RegionId.toString() === regionId) {
                    option.attr("selected", "selected");
                }

                selector.append(option);
            }

            el.parent().append(selector);

            $(document).mouseup(function (e) {
                var container = $("#add-region-link");

                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    var newRegionId = container.find(":selected").attr("region-id");
                    if (newRegionId !== regionId && parseInt(regionId) === 0 && parseInt(newRegionId) !== -1) {
                        var criteria = {
                            LeagueId: leagueId,
                            RegionId: newRegionId
                        };

                        leagueRegionManagementService.InsertLeagueRegion(criteria).then(function () {
                            leagueRegionManagement.Result = leagueRegionManagementService.Result;

                            if (leagueRegionManagement.Result.IsSuccessful) {
                                common.ShowInfoMessage(messages.AddLeagueRegionSuccessfully);

                                for (var i = 0; i < leagueRegionManagement.LeagueRegions.length; i++) {
                                    var item = leagueRegionManagement.LeagueRegions[i];
                                    if (item.LeagueId === parseInt(leagueId)) {
                                        item.RegionId = parseInt(newRegionId);
                                        item.RegionName = container.find(":selected").text();
                                        break;
                                    }
                                }

                            } else {
                                common.ShowErrorMessage(leagueRegionManagement.Result.Message);
                            }
                        });

                        el.attr('data-region-id', newRegionId);
                        el.text(container.find(":selected").text());
                    }
                    else if (newRegionId !== regionId && parseInt(regionId) !== 0) {
                        var criteria = {
                            LeagueId: leagueId,
                            RegionId: newRegionId
                        };
                        leagueRegionManagementService.UpdateLeagueRegion(criteria).then(function () {
                            leagueRegionManagement.Result = leagueRegionManagementService.Result;

                            if (leagueRegionManagement.Result.IsSuccessful) {
                                common.ShowInfoMessage(messages.UpdateLeagueRegionSuccessfully);

                                for (var i = 0; i < leagueRegionManagement.LeagueRegions.length; i++) {
                                    var item = leagueRegionManagement.LeagueRegions[i];
                                    if (item.LeagueId === parseInt(leagueId)) {
                                        item.RegionId = parseInt(newRegionId);
                                        item.RegionName = container.find(":selected").text();
                                        break;
                                    }
                                }

                            } else {
                                common.ShowErrorMessage(leagueRegionManagement.Result.Message);
                            }
                        });

                        el.attr('data-region-id', newRegionId);
                        el.text(container.find(":selected").text());
                    }

                    container.remove();
                    el.show();

                    $(document).off("mouseup");
                }
            });
        });

        domElements.leagueRegionFilterForm.on('click', "#btnSearch", function () {
            if (validator.ValidateForm(domElements.leagueRegionFilterForm, 'w')) {
                leagueRegionManagement.GetLeagueRegions();
            }
        });
    };

    function reRenderAfterPaged(pageIndex, itemsPerPage) {
        leagueRegionManagement.pagingManual.pageIndex = pageIndex;
        leagueRegionManagement.pagingManual.itemsPerPage = itemsPerPage;

        renderGrid(leagueRegionManagement.LeagueRegions.slice(leagueRegionManagement.pagingManual.pageIndex * leagueRegionManagement.pagingManual.itemsPerPage,
            leagueRegionManagement.pagingManual.itemsPerPage * (leagueRegionManagement.pagingManual.pageIndex + 1)));

        return false;
    }

    return leagueRegionManagement;
})(jQuery);