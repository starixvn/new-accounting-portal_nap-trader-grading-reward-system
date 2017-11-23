function BettypeManagement() {
    var grid = $('#bettypeGrid');
    var newBettypeForm = $("#AddNewTeamForm").clone()

    function createColumns(columnLabel) {
        var obj =
            {
                HeaderText: columnLabel,
                Name: columnLabel,
                HeaderAlign: 'center',
                CellAlign: 'center',
                Width: 80
            };

        return obj
    }

    function renderValue(id, name, value) {
        if (typeof value === "boolean") return "<input type='checkbox' class='editable' name='{0}'  {1}/>".format(name, value ? "checked" : "");

        if (name == "Group") {
            var major = value == "Major" ? "selected" : "";
            var ph = value == "PH" ? "selected" : "";
            return "<span>{0}</span><select class='editable hide' data-id='{3}' name='{4}' style='width: 100%'><option value='1' {1}>Major</option><option value='2' {2}>PH</option></select>".format(value, major, ph, id, name);
        }

        var input = "<input type='text' class='editable hide' name='{0}' data-id='{1}' {2} style='width:100%; padding: 0'/>".format(name, id, isNaN(value) ? "" : "data-val-number='adfda'");

        if (value === null || value === undefined) return "<form><span>-</span>{0}</form>".format(input);
        return "<form onsubmit='return false'><span>{0}</span>{1}</form>".format(value, input);
    }

    function createRow(value, index) {
        var columns = [];

        var id = value["Bet Type ID"];

        columns[0] = { Name: "#", Value: index + 1 };

        for (var i = 0; i < bettypeColumns.length; i++) {
            var name = bettypeColumns[i];
            columns[i + 1] = { Name: name, Value: renderValue(id, name, value[name]) };
        }

        return { Columns: columns };
    }

    function renderColumns(columns) {
        columns[1].CellAlign = "left";
        columns[1].Width = 250;

        columns[5].Width = 120;
    }

    function renderEdit($target) {
        $target.addClass("hide")
        var $input = $target.next().removeClass("hide").focus();
        var val = $target.text();
        if (val != "-") $input.val(val);
    }

    function renderGrid(data) {
        var tmp = bettypeColumns.slice();
        tmp.unshift("#");
        var columns = tmp.map(createColumns);
        var gridOptions = {};

        renderColumns(columns);

        gridOptions.columns = columns;
        gridOptions.bodyRows = data.map(createRow);
        grid.showNumberColumn = true;

        grid.fanexGrid(gridOptions);

        $(".editable:not(:checkbox)")
            .focusout(function (e) {
                var $this = $(e.target);
                var oldVal = $this.addClass("hide").prev().removeClass("hide").text();
                if (oldVal != "-") $this.val(oldVal);
                else $this.val("");
            })
            .change(e => updateBettype($(e.target)))
            .parent().click(e => renderEdit($("span", e.target)))
            .children("span").click(e => renderEdit($(e.target)));
    }

    function getBettypes() {
        var url = common.ResolveRootUrl('Configuration/BettypeManagement/GetAllBettype')
        $.post(url, renderGrid);
    }

    function insertNewBettypeCallBack($form, result) {
        var $div = $("#divErrorSuccessMsg", $form);

        if (result.IsSuccessful) {
            common.ShowInlineSuccessMsg($div, messages.AddBettypeSuccessfully, false, function () {
                timeout = setTimeout(common.ClosePopup, 3000);
            });
            disablePopup();
            getBettypes();
        }
        else {
            common.ShowInlineErrorMsg($div, result.ErrorMessage);
            return false;
        }
    }

    function insertNewBettype($form) {
        if (validator.ValidateForm($form, "w")) {
            var url = common.ResolveRootUrl('Configuration/BettypeManagement/InserNewBettype')
            var data = {};
            var $inputs = $("input[name], select[name]", $form)

            for (var i = 0; i < $inputs.length; i++) {
                var $input = $inputs.eq(i);

                if ($input.is(":checkbox")) data[$input.attr("name")] = $input.is(":checked");
                else data[$input.attr("name")] = $input.val();
            }

            console.log(data);
            $.post(url, data, result => insertNewBettypeCallBack($form, result));
        }
    }

    function makeNewBettypeForm() {
        var form = newBettypeForm.clone();

        common.Modal(labels.NewBettype, form);

        $("#btnSave", form).click(() => insertNewBettype(form));
    }

    function updateBettype($editable){
        var url = common.ResolveRootUrl('Configuration/BettypeManagement/UpdateBettype');

        var data = {};
        data.BettypeId = $editable.attr("data-id");
        var attr = $editable.attr("name").replace(/ /g, "");

        data[attr.includes("ID") ? "New" + attr: attr] = $editable.val();

        $.post(url, data);

        console.log(data);
    }

    getBettypes();

    $("#lnkAddNewBettype").click(makeNewBettypeForm);

    $("#divHiddenForm").empty();
}

$(BettypeManagement);