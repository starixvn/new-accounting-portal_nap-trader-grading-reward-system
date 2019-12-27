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
        lblTotal8RMWLMargin: null
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
    };

    var initializeFields = function () {
        domElements.btnToggle.hide();
        displayInfoSummary(false);

        domElements.btnToggle.click(function () {
            $(this).toggleClass("expanded");
            if ($(this).hasClass('expanded')) {
                setStogeDisplayInfoSummary("true");
                domElements.divInfoSummary.show();
            } else {
                setStogeDisplayInfoSummary("false");
                domElements.divInfoSummary.hide();
            }
        });
    }

    var displayInfoSummary = function (isShow) {
        var isStoreDisplay = getStogeDisplayInfoSummary();
        if (isShow && (isStoreDisplay == null || isStoreDisplay == "true")) {
            domElements.btnToggle.addClass("expanded");
            domElements.divInfoSummary.show();
        } else {
            domElements.divInfoSummary.hide();
        }
    }

    var setStogeDisplayInfoSummary = function (value) {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("StogeDisplayInfoSummary", value);
        }
    }

    var getStogeDisplayInfoSummary = function () {
        if (typeof (Storage) !== "undefined") {
            var value = localStorage.getItem("StogeDisplayInfoSummary");
            return value;
        }
        return "false";
    }

    $this.DisplayInfoSummary = function (isShow) {
        domElements.btnToggle.show();
        displayInfoSummary(isShow);
    }

    $this.BindDataInfoSummary = function (data, leagueTotal, matchTotal) {
        var leagueMatchesFormat = '{0} {1}/{2} {3}';       
        domElements.lblLeagueMatches.text(leagueMatchesFormat.format(leagueTotal, labels.Leagues, matchTotal, labels.Matches));
        domElements.lblVirtualTotalTurnover.text(numeral(data.VirtualTotalTurnover).format(common.Formats.IntegerFormat));
        domElements.lblVirtualTotalWinLoss.text(numeral(data.VirtualTotalWinLoss).format(common.Formats.IntegerFormat));
        domElements.lblVirtualTotalMargin.text(numeral(data.VirtualTotalMargin).format(common.Formats.DecimalFormat));
        domElements.lblVarianceTurnover.text(numeral(data.VarianceTurnover).format(common.Formats.IntegerFormat));
        domElements.lblVarianceWinLoss.text(numeral(data.VarianceWinLoss).format(common.Formats.IntegerFormat));
        domElements.lblVarianceMargin.text(numeral(data.VarianceMargin).format(common.Formats.DecimalFormat));
        domElements.lblRealTotalTurnover.text(numeral(data.RealTotalTurnover).format(common.Formats.IntegerFormat));
        domElements.lblRealTotalWinLoss.text(numeral(data.RealTotalWinLoss).format(common.Formats.IntegerFormat));
        domElements.lblRealTotalMargin.text(numeral(data.RealTotalMargin).format(common.Formats.DecimalFormat));
        domElements.lblTotal8RMTurnover.text(numeral(data.Total8RMTurnover).format(common.Formats.IntegerFormat));
        domElements.lblTotal8RMWinLoss.text(numeral(data.Total8RMWinLoss).format(common.Formats.IntegerFormat));
        domElements.lblTotal8RMMargin.text(numeral(data.Total8RMMargin).format(common.Formats.DecimalFormat));
        domElements.lblTotal8RMWLTurnover.text(numeral(data.Total8RMWLTurnover).format(common.Formats.IntegerFormat));
        domElements.lblTotal8RMWLWinLoss.text(numeral(data.Total8RMWLWinLoss).format(common.Formats.IntegerFormat));
        domElements.lblTotal8RMWLMargin.text(numeral(data.Total8RMWLMargin).format(common.Formats.DecimalFormat));
    }

    $this.InitPage = function () {
        cacheDOMElements();
        initializeFields();
    }
}