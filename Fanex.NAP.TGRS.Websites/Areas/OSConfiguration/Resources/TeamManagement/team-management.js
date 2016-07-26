$(function () {
    var insertForm = {
        html: $("#divInsertTeamForm"),
        txtBox: $("#txtTeamName"),
        btnCancel: $("#btnCancel")
    };

   $("#lnkAddNewTeam").click(function () {
       insertForm.txtBox.val("");
       common.Modal(labels.NewTeam, insertForm.html);
       insertForm.btnCancel.click(common.ClosePopup);
   });
})