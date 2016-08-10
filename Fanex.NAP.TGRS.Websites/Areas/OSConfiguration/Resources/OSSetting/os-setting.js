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

    var sportData = [];

    var leagueData = [];

    function updateGlobalTargetResult(result) {
        if (result.Code == 0) {
            common.ShowInfoMessage("Global target updated successfully");
        } else {
            common.ShowErrorMessage(result.Message);
        }
        $("a", "#msgbox2").css("width", "17px").css("height", "18px");
    }

    function handleSuggestSport() {
        var input = $("#txtSport", domElements.addSettingForm);

        input.autocomplete({
            source: function (req, resp) {
                var criteria = {
                    SportName: input.val()
                };

                OSSettingService.SuggestSport(criteria, function (data) {
                    sportData = data;
                    resp(data.map(function (e) {
                        return e.SportName;
                    }));
                });
            },
            minLength: 3
        });
    }

    function handleSuggestLeague() {
        var txtSport = $("#txtSport", domElements.addSettingForm);

        var txtLeague = $("#txtLeague", domElements.addSettingForm);

        txtLeague.autocomplete({
            source: function (req, resp) {
                var sport = sportData.find(function (e) {
                    return e.SportName == txtSport.val();
                });

                if (sport == null) {
                    resp([]);
                } else {
                    var criteria = {
                        SportId: sport.SportId,
                        LeagueName: txtLeague.val()
                    };

                    OSSettingService.SuggestLeague(criteria, function (data) {
                        leagueData = data;
                        resp(data.map(function (e) {
                            return e.LeagueName;
                        }));
                    });
                }
            },
            minLength: 3
        });
    }

    function handlePageEvents() {
        $("#globalTarget", domElements.globalTargetForm).click(function () {
            var $this = $(this).addClass('hidden');

            var value = $this.text();

            $("#txtGlobalTarget", domElements.globalTargetForm).css('visibility', 'visible').val(value).focus()
                .keyup(function (e) {
                    var $input = $(this);
                    if (e.keyCode == 13) {
                        if (validator.ValidateForm(domElements.globalTargetForm, 'w')) {
                            var criteria = {
                                GlobalTarget: parseFloat($input.val())
                            };

                            if (criteria.GlobalTarget < 0 || criteria.GlobalTarget > 100) {
                                common.ShowErrorMessage(messages.InvalidValue);
                                $("a", "#msgbox2").css("width", "17px").css("height", "18px");
                            } else {
                                OSSettingService.UpdateGlobalTarget(criteria, updateGlobalTargetResult);
                            }
                        } else {
                            $(".error-tipsy.error-tipsy-w", domElements.globalTargetForm).css("margin-left", "20px");
                            setTimeout(function () {
                                validator.ClearErrors(domElements.globalTargetForm);
                            }, 1000);
                        }
                    }
                    else if (e.keyCode == 27) {
                        $input.css("visibility", "hidden");
                        $this.removeClass("hidden");
                    }
                });
        });

        $("#txtSport", domElements.addSettingForm).autocomplete({
            source: OSSettingService.SuggestSport()
        });

        $("#btnAdd", domElements.addSettingForm).click(function () {
            if (validator.ValidateForm(domElements.addSettingForm, 'w')) {
            } else {
                setTimeout(function () {
                    validator.ClearErrors(domElements.addSettingForm);
                }, 1000);
            }
        });

        domElements.TargetGrid.on('click', '.target-link.link', function () {
            var $this = $(this).addClass("hide");

            var input = $this.next();
            input.val($this.text());

            input.removeClass("hide").focus().keyup(function (e) {
                if (e.keyCode == 13) {
                    var val = parseFloat(input.val());

                    if (input.val() != val) {
                        common.ShowErrorMessage(messages.NotANumber);
                    }
                    else if (val > 100 || val < 0) {
                        common.ShowErrorMessage(messages.InvalidValue);
                    }
                    else {
                        alert("ok");
                    }
                }
                $("a", "#msgbox2").css("width", "17px").css("height", "18px");
            });
        });
    }

    function renderGrid(data) {
        var targetLink = '<span class="target-link link">{0}</span>' +
            '<input data-sport-id="{1}" data-league-id="{2}" data-bettype-id="{3}"' +
            'type="text" maxlength="5" class="hide" style="width: 80px !important;height: 15px;"/>';

        var deleteButton = '<span class="target-delete-button" ' +
            'data-sport-id = "{0}" data-league-id="{1}" data-bettype-id="{2}" ></span>';

        var mapper = function (item, idx) {
            return {
                Columns: [
                    { Name: 'colNum', Value: idx + 1 },
                    { Name: 'colSport', Value: item.SportName },
                    { Name: 'colLeague', Value: item.LeagueName },
                    { Name: 'colBettype', Value: item.BetTypeName },
                    { Name: 'colTarget', Value: targetLink.format(item.Target, item.SportId, item.LeagueId, item.BettypeId) },
                    { Name: 'colDelete', Value: deleteButton.format(item.SportId, item.LeagueId, item.BetTypeId) }
                ]
            };
        }

        var options = {
            columns: [
                { HeaderText: '#', Width: 40, Name: 'colNum', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Sport', Width: 200, Name: 'colSport', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'League ', Width: 400, Name: 'colLeague', HeaderAlign: 'center', CellAlign: 'left' },
                { HeaderText: 'Bet Type', Width: 100, Name: 'colBettype', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: 'Target', Width: 80, Name: 'colTarget', HeaderAlign: 'center', CellAlign: 'center' },
                { HeaderText: '', Width: 60, Name: 'colDelete', HeaderAlign: 'center', CellAlign: 'center' }
            ],
            showNumberColumn: true,
            bodyRows: data.map(mapper)
        };

        domElements.TargetGrid.fanexGrid(options);
    }

    function getTarget() {
        OSSettingService.GetTarget(renderGrid);
    }

    setting.Initialize = function () {
        cacheDome();

        handleSuggestSport();

        handleSuggestLeague();

        handlePageEvents();

        getTarget();
    }

    return setting;
})(jQuery);

$(function () {
    OSSetting.Initialize();
})