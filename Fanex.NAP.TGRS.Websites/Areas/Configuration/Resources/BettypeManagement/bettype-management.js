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
        if (typeof value === "boolean") return "<input type='checkbox' class='editable' name='{0}'  {1} data-id='{2}'/>".format(name, value ? "checked" : "", id);

        if (name == "Group") {
            var major = value == "Major" ? "selected='selected'" : "";
            var ph = value == "PH" ? "selected='selected'" : "";
            return "<span>{0}</span><select class='editable display-none' data-id='{1}' name='{2}' style='width: 100%'><option value='1'>Major</option><option value='2'>PH</option></select>".format(value, id, name);
        }

        var input = "<input type='text' class='editable display-none' name='{0}' data-id='{1}' style='width:100%; padding: 0'/>".format(name, id);

        if (value === null || value === undefined) return "<span>-</span>{0}".format(input);
        return "<span>{0}</span>{1}".format(value, input);
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
        $target.addClass("display-none")
        var $editable = $target.next().removeClass("display-none").focus();
        var val = $target.text();

        if ($editable.is("select")) {
            $editable.val(val == "Major" ? "1" : "2");
            return;
        }

        if (val != "-") $editable.val(val);
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

        common.EnableInput();

        $(".editable:not(:checkbox)")
            .keydown(e => e.keyCode == 27 ? $(e.target).focusout(): 1)
            .focusout(e => focusOut($(e.target)))
            .change(e => updateBettype($(e.target)))
            .parent().click(e => renderEdit($("span", e.target)))
            .children("span").click(e => renderEdit($(e.target)));

        $("input.editable:checkbox").change(e => updateBettype($(e.target)));
    }

    function getBettypes() {
        common.DisableInput();
        var url = common.ResolveRootUrl('Configuration/BettypeManagement/GetAllBettype')
        $.post(url, renderGrid);
    }

    function insertNewBettypeCallBack($form, result) {
        var $div = $("#divErrorSuccessMsg", $form);

        if (result.IsSuccessful) {
            common.ShowInlineSuccessMsg($div, messages.AddBettypeSuccessfully, false, function () {
                timeout = setTimeout(common.ClosePopup, 1000);
            });

            getBettypes();
        }
        else {
            common.ShowInlineErrorMsg($div, result.Message);
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

        $("#btnCancel", form).click(() => common.ClosePopup());
    }

    function focusOut($editable) {
        var oldVal = $editable.addClass("display-none").prev().removeClass("display-none").text();
        if (oldVal != "-") $editable.val(oldVal);
        else $editable.val("");
    }

    function updateBettype($editable) {
        var val = $editable.val();

        if ($editable.is(":checkbox")) val = $editable.is(":checked");

        if (val != null && val !== "" && $(val).length == 0) {
            var url = common.ResolveRootUrl('Configuration/BettypeManagement/UpdateBettype');

            var data = {};
            data.BettypeId = $editable.attr("data-id");
            var attr = $editable.attr("name").replace(/ /g, "");

            if ((attr == "BetTypeID" || attr == "OperatorType" || attr == "AssignmentBetType") && isNaN(val)) {
                common.ShowErrorMessage(messages.InvalidValueError);
                return;
            }

            data[attr.includes("ID") ? "New" + attr : attr] = val;

            $.post(url, data, result => updateBettypeCallback($editable, result, val));

            console.log(data);
        }
        else {
            common.ShowErrorMessage(messages.InvalidValueError);
        }
    }

    function updateBettypeCallback($editable, result, newVal) {
        if (result.IsSuccessful) {
            common.ShowInfoMessage(messages.UpdateBettypeSucessully);

            $editable.val(newVal);

            if ($editable.is("select")) $editable.prev().text(newVal == "1" ? "Major" : "PH");
            else $editable.prev().text(newVal);

            $editable.focusout();
        }
        else {
            common.ShowErrorMessage(result.Message);
        }
    }

    getBettypes();

    $("#lnkAddNewBettype").click(makeNewBettypeForm);

    $("#divHiddenForm").empty();
}

$(BettypeManagement);