Namespace.Register('Fanex.NAP.TGRS.RT3PerformanceDetail.SummaryPerformance');
Fanex.NAP.TGRS.RT3PerformanceDetail.SummaryPerformance = function () {
    var $this = this;

    var domElements = {
        btnToggle: null,
        divInfoSummary: null,
        lblLeagueMatches: null,
        lblVirtualTotalTurnover: null,
        lblVirtualTotalWinLoss: null,
        lblVirtualTotalMargin: null,
        lblVarianceTurnover: null,
        lblVarianceWinLoss: null,
        lblVarianceMargin: null,
        lblRealTotalTurnover: null,
        lblRealTotalWinLoss: null,
        lblRealTotalMargin: null,
        lblTotal8RMTurnover: null,
        lblTotal8RMWinLoss: null,
        lblTotal8RMMargin: null,
        lblTotal8RMWLTurnover: null,
        lblTotal8RMWLWinLoss: null,
        lblTotal8RMWLMargin: null,
        divChartContainer: null
    };

    var cacheDOMElements = function () {
        domElements.btnToggle = $('#btnToggle');
        domElements.divInfoSummary = $('#divInfoSummary');
        domElements.lblLeagueMatches = $('#lblLeagueMatches');
        domElements.lblVirtualTotalTurnover = $('#lblVirtualTotalTurnover');
        domElements.lblVirtualTotalWinLoss = $('#lblVirtualTotalWinLoss');
        domElements.lblVirtualTotalMargin = $('#lblVirtualTotalMargin');
        domElements.lblVarianceTurnover = $('#lblVarianceTurnover');
        domElements.lblVarianceWinLoss = $('#lblVarianceWinLoss');
        domElements.lblVarianceMargin = $('#lblVarianceMargin');
        domElements.lblRealTotalTurnover = $('#lblRealTotalTurnover');
        domElements.lblRealTotalWinLoss = $('#lblRealTotalWinLoss');
        domElements.lblRealTotalMargin = $('#lblRealTotalMargin');
        domElements.lblTotal8RMTurnover = $('#lblTotal8RMTurnover');
        domElements.lblTotal8RMWinLoss = $('#lblTotal8RMWinLoss');
        domElements.lblTotal8RMMargin = $('#lblTotal8RMMargin');
        domElements.lblTotal8RMWLTurnover = $('#lblTotal8RMWLTurnover');
        domElements.lblTotal8RMWLWinLoss = $('#lblTotal8RMWLWinLoss');
        domElements.lblTotal8RMWLMargin = $('#lblTotal8RMWLMargin');
        domElements.divChartContainer = $('#divChartContainer');
    };

    var initializeFields = function () {
        domElements.btnToggle.hide();
        displaySummary(false);

        domElements.btnToggle.click(function () {
            $(this).toggleClass("expanded");
            if ($(this).hasClass('expanded')) {
                setStogeDisplaySummary("true");
                domElements.divInfoSummary.show();
                domElements.divChartContainer.show();
            } else {
                setStogeDisplaySummary("false");
                domElements.divInfoSummary.hide();
                domElements.divChartContainer.hide();
            }
        });
    }

    var displaySummary = function (isShow) {
        var isStoreDisplay = getStogeDisplaySummary();
        if (isShow && (isStoreDisplay == null || isStoreDisplay == "true")) {
            domElements.btnToggle.addClass("expanded");
            domElements.divInfoSummary.show();
        } else {
            domElements.divInfoSummary.hide();
        }
    }

    var setStogeDisplaySummary = function (value) {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("StogeDisplaySummaryAndChart", value);
        }
    }

    var getStogeDisplaySummary = function () {
        if (typeof (Storage) !== "undefined") {
            var value = localStorage.getItem("StogeDisplaySummaryAndChart");
            return value;
        }
        return "false";
    }

    $this.Display = function (isShow) {
        domElements.btnToggle.show();
        displaySummary(isShow);
    }

    $this.BindData = function (data, leagueTotal, matchTotal) {
        var leagueMatchesFormat = '{0} {1}/{2} {3}';       
        domElements.lblLeagueMatches.text(
            leagueMatchesFormat.format(
                numeral(leagueTotal).format(common.Formats.IntegerFormat),
                labels.Leagues,
                numeral(matchTotal).format(common.Formats.IntegerFormat),
                labels.Matches
        ));
        domElements.lblVirtualTotalTurnover.text(
            numeral(data.VirtualTotalTurnover).format(common.Formats.IntegerFormat)
        );
        domElements.lblVirtualTotalWinLoss.text(
            numeral(data.VirtualTotalWinLoss).format(common.Formats.IntegerFormat)
        );
        domElements.lblVirtualTotalMargin.text(
            numeral(data.VirtualTotalMargin).format(common.Formats.DecimalFormat) + ' %'
        );
        domElements.lblVarianceTurnover.text(
            numeral(data.VarianceTurnover).format(common.Formats.IntegerFormat)
        );
        domElements.lblVarianceWinLoss.text(
            numeral(data.VarianceWinLoss).format(common.Formats.IntegerFormat)
        );
        domElements.lblVarianceMargin.text(
            numeral(data.VarianceMargin).format(common.Formats.DecimalFormat) + ' %'
        );
        domElements.lblRealTotalTurnover.text(
            numeral(data.RealTotalTurnover).format(common.Formats.IntegerFormat)
        );
        domElements.lblRealTotalWinLoss.text(
            numeral(data.RealTotalWinLoss).format(common.Formats.IntegerFormat)
        );
        domElements.lblRealTotalMargin.text(
            numeral(data.RealTotalMargin).format(common.Formats.DecimalFormat) + ' %'
        );
        domElements.lblTotal8RMTurnover.text(
            numeral(data.Total8RMTurnover).format(common.Formats.IntegerFormat)
        );
        domElements.lblTotal8RMWinLoss.text(
            numeral(data.Total8RMWinLoss).format(common.Formats.IntegerFormat)
        );
        domElements.lblTotal8RMMargin.text(
            numeral(data.Total8RMMargin).format(common.Formats.DecimalFormat) + ' %'
        );
        domElements.lblTotal8RMWLTurnover.text(
            numeral(data.Total8RMWLTurnover).format(common.Formats.IntegerFormat)
        );
        domElements.lblTotal8RMWLWinLoss.text(
            numeral(data.Total8RMWLWinLoss).format(common.Formats.IntegerFormat)
        );
        domElements.lblTotal8RMWLMargin.text(
            numeral(data.Total8RMWLMargin).format(common.Formats.DecimalFormat) + ' %'
        );
    }

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    }
}