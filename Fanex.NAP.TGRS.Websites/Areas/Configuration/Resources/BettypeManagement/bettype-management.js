function BettypeManagement() {
    var grid = $('#bettypeGrid');
    var newBettypeForm = $("#AddNewTeamForm").clone();
  
    function renderGrid(data) {
        var gridOptions = {};
        gridOptions.columns = generateColumns();
        gridOptions.bodyRows = generateGridBody(data);
        grid.showNumberColumn = true;
        grid.fanexGrid(gridOptions);

        common.EnableInput();

        $(".editable:not(:checkbox)")
            .keydown(e => e.keyCode === 27 ? $(e.target).focusout() : 1)
            .focusout(e => focusOut($(e.target)))
            .change(e => validateAndUpdateBettype($(e.target), data.GroupList))
            .parent().click(e => renderEdit($("span", e.target)))
            .children("span").click(e => renderEdit($(e.target)));

        $("input.editable:checkbox").change(e => validateAndUpdateBettype($(e.target), data.GroupList));
    }

    function renderEdit($target) {
        $target.addClass("display-none");
        let $editable = $target.next().removeClass("display-none").focus();        
        let val = $editable.is("select")
            ? $target.attr('data-group-id')
            : $target.text();

        if (val !== "-")
            $editable.val(val);  
    }

    function generateColumns() {
        return [
            { HeaderText: "#", Width: 80, Name: "ColIndex", HeaderAlign: "center", CellAlign: "center", Sort: false },
            { HeaderText: "Bet Type Name", Width: 320, Name: "ColBetTypeName", HeaderAlign: "center", CellAlign: "left", Sort: false },
            { HeaderText: "Bet Type ID", Width: 100, Name: "ColBetTypeId", HeaderAlign: "center", CellAlign: "center", Sort: false },
            { HeaderText: "Group", Width: 140, Name: "ColGroup", HeaderAlign: "center", CellAlign: "center", Sort: false },
            { HeaderText: "Bet Type Group", Width: 140, Name: "ColGroupBetTypeName", HeaderAlign: "center", CellAlign: "center", Sort: false },
            { HeaderText: "Operator Type", Width: 100, Name: "ColOperatorType", HeaderAlign: "center", CellAlign: "center", Sort: false },
            { HeaderText: "Assignment Bet Type", Width: 140, Name: "ColAssignmentBetType", HeaderAlign: "center", CellAlign: "center", Sort: false },
            { HeaderText: "Used For Juice", Width: 100, Name: "ColUsedForJuice", HeaderAlign: "center", CellAlign: "center", Sort: false },
            { HeaderText: "Active", Width: 100, Name: "ColActive", HeaderAlign: "center", CellAlign: "center", Sort: false }
        ];
    }

    function generateGridBody(data) {
        let bodyData = [];
        let textFormat = '<span>{0}</span><input type="text" class="editable display-none" name="{1}" data-id="{2}" style="width:100%; padding: 0" />';
        let checkboxFormat = '<input type="checkbox" class="editable" name="{0}" {1} data-id="{2}" />';
        let optionGroupList = "<option value='1'>Major</option>"
            + "<option value='2'>PH</option>";
        let optionbetTypeGroupList = "";
        
        $.each(data.GroupList, function (_, group) {
            optionbetTypeGroupList += "<option value='" + group.GroupBetTypeId + "'>" + group.GroupBetTypeName + "</option>";
        });

        let dropdownFormat = "<span data-group-id={0}>{1}</span><select class='editable display-none' data-id='{2}' name='{3}' style='width: 100%'>{4}</select>";

        $.each(data.BetTypeList, function (betTypeIndex, betType) {
            let currentRowData = [];
            let betTypeNameCol = textFormat.format(betType.BetTypeName, "BettypeName", betType.BetTypeId);
            let betTypeIdCol = textFormat.format(betType.BetTypeId, "BettypeId", betType.BetTypeId);
            let groupCol = dropdownFormat.format(betType.Group === 'Major' ? "1" : "2", betType.Group, betType.BetTypeId, "Group", optionGroupList);
            let betTypeGroupCol = dropdownFormat.format(betType.GroupBetTypeId, betType.GroupBetTypeName, betType.BetTypeId, "GroupBettypeId", optionbetTypeGroupList);
            let operatorTypeCol = textFormat.format(betType.OperatorType !== 0 ? betType.OperatorType : "-", "OperatorType", betType.BetTypeId);
            let assignmentBetTypeCol = textFormat.format(betType.AssignmentBetType !== 0 ? betType.AssignmentBetType : "-", "AssignmentBetType", betType.BetTypeId);
            let usedForJuiceCol = checkboxFormat.format("UsedForJuice", betType.IsUsedForJuice === true ? "checked" : "", betType.BetTypeId);
            let activeCol = checkboxFormat.format("Active", betType.IsActive === true ? "checked" : "", betType.BetTypeId);

            currentRowData.push(
                { Name: 'ColIndex', Value: betTypeIndex + 1 },
                { Name: 'ColBetTypeName', Value: betTypeNameCol },
                { Name: 'ColBetTypeId', Value: betTypeIdCol },
                { Name: 'ColGroup', Value: groupCol },
                { Name: 'ColGroupBetTypeName', Value: betTypeGroupCol },
                { Name: 'ColOperatorType', Value: operatorTypeCol },
                { Name: 'ColAssignmentBetType', Value: assignmentBetTypeCol },
                { Name: 'ColUsedForJuice', Value: usedForJuiceCol },
                { Name: 'ColActive', Value: activeCol }
            );
           
            bodyData.push({
                Columns: currentRowData
            });
        });
       
        return bodyData;
    }

    function getBettypes() {
        common.DisableInput();
        var url = common.ResolveRootUrl('Configuration/BettypeManagement/GetGroupBetTypes');
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
        if (oldVal !== "-")
            $editable.val(oldVal);
        else
            $editable.val("");
    }

    function validateAndUpdateBettype($editable, groups) {
        var exp = /[!"#$%&;<=>?@[\\\]^`{|}~]/g;
        var val = $editable.val();
        var groupName = "";
        var columnName = $editable.attr("name").replace(/ /g, "");

        if ((columnName === "BettypeId" || columnName === "OperatorType" || columnName === "AssignmentBetType") && isNaN(val)) {
            common.ShowErrorMessage(messages.InvalidValueError);
            return;
        }

        if ($editable.is(":checkbox")) {
            val = $editable.is(":checked");
        } else if ($editable.is("select")) {
            if (columnName === "GroupBettypeId") {
                var group = $(groups).map(function (_, x) {
                    if (String(x.GroupBetTypeId) === val)
                        return x;
                });

                groupName = group.length > 0 ? group[0].GroupBetTypeName : '';
            } else {
                groupName = val === "1" ? "Major" : "PH";
            }
        }

        if (val !== null && val !== "" && !exp.test(val.toString()) && val.toString().length <= 50) 
            updateBettype($editable, columnName, val, groupName);
        else if (val.toString().length > 50) 
            common.ShowErrorMessage("Maximum 50 characters");
        else 
            common.ShowErrorMessage(messages.InvalidValueError);
    }

    function updateBettype($editable, columnName, val, groupName) {
        var url = common.ResolveRootUrl('Configuration/BettypeManagement/UpdateBettype');

        var data = {};
        data.BettypeId = $editable.attr("data-id");
        data[columnName === "BettypeId" ? "New" + columnName : columnName] = val;

        $.post(url, data, result => updateBettypeCallback($editable, result, val, groupName));
    }

    function updateBettypeCallback($editable, result, newVal, newText) {
        if (result.IsSuccessful) {
            common.ShowInfoMessage(messages.UpdateBettypeSucessully);

            $editable.val(newVal);

            if ($editable.is("select"))
                $editable.prev().text(newText);
            else
                $editable.prev().text(newVal);

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