function TraderPerformanceMonthlyByWeek() {
    var domElements = {
        yearSelector: '#yearSelector',
        monthSelector: '#monthSelector',
        weekSelector: '#weekSelector',
        btnExport: '#btnExport'
    }

    $(domElements.yearSelector)
        .multiselect({
            selectedList: 1,
            minWidth: 150,
            multiple: false,
            header: false,
            height: 100
        });

    $(domElements.monthSelector)
        .multiselect({
            minWidth: 150,
            height: 100,
            selectedText: function (numChecked, numTotal, checkedItems) {
                if (numChecked == 0) {
                    return "Select options";
                }
                else if (numChecked == 1) {
                    return $(checkedItems).attr('title');
                }
                else if (numChecked == numTotal) {
                    return "All";
                }
                else {
                    return numChecked + ' selected';
                }
            }
        });

    $(domElements.weekSelector)
        .multiselect({
            minWidth: 150,
            height: 100,
            selectedText: function (numChecked, numTotal, checkedItems) {
                if (numChecked == 0) {
                    return "Select options";
                }
                else if (numChecked == 1) {
                    return $(checkedItems).attr('title');
                }
                else if (numChecked == numTotal) {
                    return "All";
                }
                else {
                    return numChecked + ' selected';
                }
            }
        });

    var validateMonth = function () {
        validator.ClearError($(domElements.monthSelector).next());
        if (!$(domElements.monthSelector).val()) {
            validator.ShowError($(domElements.monthSelector).next(), 'Required field!', 'w');

            return false;
        }

        return true;
    };

    var validateWeek = function () {
        validator.ClearError($(domElements.weekSelector).next());
        if (!$(domElements.weekSelector).val()) {
            validator.ShowError($(domElements.weekSelector).next(), 'Required field!', 'w');

            return false;
        }

        return true;
    };

    var validateFilterForm = function () {
        return validateMonth() && validateWeek();
    };

    $(domElements.btnExport).click(function () {
        if (validateFilterForm()) {
            var url = common.ResolveRootUrl("Reports/TraderMonthlyReport/ExportExcelForWeek");
            var filter =
            {
                Year: $(domElements.yearSelector).val(),
                Weeks: $(domElements.weekSelector).val().join(','),
                Months: $(domElements.monthSelector).val().join(',')
            };
            common.DownloadFile(url, filter);
        }
    })
}

$(TraderPerformanceMonthlyByWeek);