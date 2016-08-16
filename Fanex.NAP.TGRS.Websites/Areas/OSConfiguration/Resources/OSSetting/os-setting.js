var OSSetting = (function ($) {
    var setting = {};

    var domElements = {
        globalTargetForm: null,
        addSettingForm: null,
        TargetGrid: null
    }

    function cacheDome() {
        domElements.globalTargetForm = $("#globalTargetForm");
        domElements.addSettingForm = $("#addSettingForm");
        domElements.TargetGrid = $("#targetGrid");
    }

    function stringDefault(str) {
        return str == null ? '-' : str;
    }

    function handlePageEvents() {
        $('[data-toggle="tooltip"]').tooltip();

        $(".parameter").click(function () {
            $(".parameter").removeClass("hidden").next().css("visibility", "hidden");

            var $this = $(this).addClass('hidden');

            var value = $this.text();

            $this.next().css('visibility', 'visible').val(value).focus()
                .keyup(function (e) {
                    var $input = $(this);
                    if (e.keyCode == 13) {
                        if (validator.ValidateForm($this.parent(), 'w')) {
                            var value = $input.attr("data-integer") != null ? parseInt($input.val()) : parseFloat($input.val());

                            var criteria = {
                                ParamId: parseInt($input.attr("data-param-id")),
                                ParamValue: value
                            };

                            if (criteria.ParamValue < 0 || criteria.ParamValue > 100 || value != $input.val()) {
                                common.ShowErrorMessage(messages.InvalidValue);
                            } else {
                                OSSettingService.UpdateParameters(criteria, function (result) {
                                    if (result.Code == 0) {
                                        common.ShowInfoMessage("successfully update parameter");
                                        $this.text(criteria.ParamValue);
                                        $input.css("visibility", "hidden");
                                        $this.removeClass("hidden");

                                    } else {
                                        common.ShowErrorMessage(result.Message);
                                    }
                                });
                            }
                        } else {
                            $(".error-tipsy.error-tipsy-w", $this.parent()).css("margin-left", "20px");
                            setTimeout(function () {
                                validator.ClearErrors(domElements.globalTargetForm);
                            }, 1000);
                        }
                    } else if (e.keyCode == 27) {
                        $input.css("visibility", "hidden");
                        $this.removeClass("hidden");
                    }
                });
        });

        $("#btnAdd", domElements.addSettingForm).click(function () {
            if (validator.ValidateForm(domElements.addSettingForm, 'w')) {
                var criteria = {
                    SportId: parseInt($("#sport").find(":selected").val()),
                    LeagueId: parseInt($("#league").find(":selected").val()),
                    BettypeId: parseInt($("#optBettype").find(":selected").val()),
                    Target: $("#targetValue").val()
                }

                if (criteria.Target < 0 || criteria.Target > 100) {
                    common.ShowErrorMessage(messages.InvalidValue);
                } else {
                    OSSettingService.AddSetting(criteria, function (result) {
                        if (result.Code == 0) {
                            common.ShowInfoMessage("successfully add new setting");
                            getSettings();
                        } else {
                            common.ShowErrorMessage(result.Message);
                        }
                    });
                }
            } else {
                setTimeout(function () {
                    validator.ClearErrors(domElements.addSettingForm);
                }, 1000);
            }
        });

        domElements.TargetGrid.on('click', '.target-link.link', function () {
            $(".target-link.link", domElements.TargetGrid).removeClass('hide').next().addClass('hide');

            var $this = $(this).addClass("hide");

            var input = $this.next();
            input.val($this.text());

            input.removeClass("hide").focus().keyup(function (e) {
                if (e.keyCode == 13) {
                    var val = parseFloat(input.val());

                    if (input.val() != val) {
                        common.ShowErrorMessage(messages.NotANumber);
                    } else if (val > 100 || val < 0) {
                        common.ShowErrorMessage(messages.InvalidValue);
                    } else {
                        var criteria = {
                            SpecialTargetId: input.attr("data-target-id"),
                            NewTarget: input.val()
                        }

                        OSSettingService.UpdateTarget(criteria, function (result) {
                            if (result.Code == 0) {
                                common.ShowInfoMessage("successfully update setting");
                                $this.text(criteria.ParamValue);
                                input.addClass("hide");
                                $this.removeClass("hide").text(criteria.NewTarget);
                                $("a", "#msgbox2").css("width", "17px").css("height", "18px");
                            } else {
                                common.ShowErrorMessage(result.Message);
                            }
                        });
                    }
                    $("a", "#msgbox2").css("width", "17px").css("height", "18px");
                }
            });
        });

        domElements.TargetGrid.on('click', '.target-delete-button', function () {
            var $this = $(this);
            common.ShowConfirmMessage("Are you sure you want to delete this setting ?", function () {
                var criteria = {
                    SpecialTargetId: $this.attr("data-target-id")
                };

                OSSettingService.DeleteSetting(criteria, function (result) {
                    if (result.Code == 0) {
                        common.ShowInfoMessage("successfully delete setting");
                        getSettings();
                    } else {
                        common.ShowErrorMessage(result.Message);
                    }
                    $("a", "#msgbox2").css("width", "17px").css("height", "18px");
                });
            });
        });
    }

    function renderGrid(data) {
        var targetLink = '<span class="target-link link">{0}</span>' +
            '<input data-target-id="{1}"' +
            'type="text" maxlength="5" class="hide" style="height: 17px;width: 100%"/>';

        var deleteButton = '<span class="target-delete-button" ' +
            'data-target-id="{0}" ></span>';

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colSport', Value: item.SportName },
                    { Name: 'colLeague', Value: stringDefault(item.LeagueName) },
                    { Name: 'colBettype', Value: stringDefault(item.BettypeName) },
                    { Name: 'colTarget', Value: targetLink.format(item.Target, item.SpecialTargetId) },
                    { Name: 'colDelete', Value: deleteButton.format(item.SpecialTargetId) }
                ]
            };
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center', },
                { HeaderText: 'Sport', Width: 100, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
                { HeaderText: 'League ', Width: 600, Name: 'colLeague', HeaderAlign: 'center', CellAlign: 'left', Sort: true },
                { HeaderText: 'Bet Type', Width: 200, Name: 'colBettype', HeaderAlign: 'center', CellAlign: 'center', Sort: true },
                { HeaderText: 'Target', Width: 80, Name: 'colTarget', HeaderAlign: 'center', CellAlign: 'center', Sort: true },
                { HeaderText: '', Width: 60, Name: 'colDelete', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper),
            fullHeight: false,
            gridHeight: 400,
            showPager: true,
            pagerOption: {
                currentPage: 0,
                itemsPerPage: common.Constants.PageSize,
                itemsPerPageArray: common.Constants.PagerRanges
            }
        };

        domElements.TargetGrid.fanexGrid(options);
    }

    function getSettings() {
        OSSettingService.GetSettings(renderGrid);
    }

    function getParameters() {
        OSSettingService.GetParameters(function (result) {
            $("#globalTarget", domElements.globalTargetForm).text(result.Global.ParamValue).next().attr("data-param-id", result.Global.ParamId);
            result.Other.forEach(function (e) {
                $("#" + e.ParamName).text(e.ParamValue).next().attr("data-param-id", e.ParamId);
            });
        });
    }

    function getSports() {
        OSSettingService.GetSports(function (data) {
            var sportSelector = $("#sport");;

            var leagueSelector = $("#league");

            data.forEach(function (e) {
                sportSelector.append($("<option></option>").attr("value", e.SportId).text(e.SportName));
            });

            sportSelector.multiselect({
                selectedList: 1,
                multiple: false,
                minWidth: 262,
                height: 200,
            }).multiselectfilter({ width: 100 });

            sportSelector.change(function () {
                var criteria = {
                    SportId: parseInt(sportSelector.find(":selected").val())
                }

                OSSettingService.GetLeagues(criteria, function (data1) {
                    leagueSelector.children("option").remove();
                    leagueSelector.append($("<option></option>").attr("value", "-1").text("All Leagues"));
                    data1.forEach(function (e) {
                        leagueSelector.append($("<option></option>").attr("value", e.LeagueId).text(e.LeagueName));
                    });

                    leagueSelector.css("visibility", "visible").multiselect({
                        selectedList: 1,
                        multiple: false,
                        minWidth: 262,
                        height: 200,
                    }).multiselectfilter({ width: 200 });
                });
            });

            sportSelector.change();
        });
    }

    function getBettypes() {
        OSSettingService.GetBettypes(function (data) {
            var selector = $("#optBettype");

            data.forEach(function (e) {
                selector.append($("<option></option>").attr("value", e.BettypeId).text(e.BettypeName));
            });

            selector.multiselect({
                selectedList: 1,
                multiple: false,
                minWidth: 194,
                height: 200,
            }).multiselectfilter({ width: 100 });
        });
    }

    setting.Initialize = function () {
        cacheDome();

        getSettings();

        getParameters();

        getSports();

        getBettypes();

        handlePageEvents();
    }

    return setting;
})(jQuery);

$(function () {
    OSSetting.Initialize();
})