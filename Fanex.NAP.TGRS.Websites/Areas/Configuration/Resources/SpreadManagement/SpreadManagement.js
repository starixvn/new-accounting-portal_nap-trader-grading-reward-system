$("#browseBtn").click(function () {
    $("#File").click();
});

$("#File").change(function () {
    $("#FileName").val($(this).val());
});

$("#uploadBtn").click(function () {
    spreadManagementService.showPopupResult();
});
