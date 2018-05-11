var base_url = window.location.protocol + "//" + window.location.host;
var git_index;
var yaml_index;
var yaml_name;

function sda_manager_control_show() {
    $("#sda_main").removeClass("sda_container")
    $("#sda_main").addClass("sda_container_with_control")
    $("#sda_main").removeClass("col-lg-12")
    $("#sda_main").addClass("col-lg-9")

    $("#sda_side").removeClass("div_hidden")
    $("#sda_side").addClass("div_show")
    $("#sda_side").removeClass("col-lg-0")
    $("#sda_side").addClass("col-lg-3")
}

function sda_manager_control_hide() {
    $("#sda_main").removeClass("sda_container_with_control");
    $("#sda_main").addClass("sda_container");
    $("#sda_main").removeClass("col-lg-9")
    $("#sda_main").addClass("col-lg-12")

    $("#sda_side").removeClass("div_show");
    $("#sda_side").addClass("div_hidden");
    $("#sda_side").removeClass("col-lg-3");
    $("#sda_side").addClass("col-lg-0");
}

function delete_git(trNum) {
    $("#git_tbody").empty();
    $("#git_name").val("");
    $("#git_address").val("");
    $("#textarea_yaml").val("");
    $.ajax({
        url: base_url + "/sdamanager/git",
        type: "GET",
        dataType: "json",
        error: function (error) {
            swal("server return error", "", "error");
        },
        success: function (data, code) {
            if (code == "success") {
                var list = $.parseJSON(data);
                list.gits.splice(trNum, 1);
                $.ajax({
                    url: base_url + "/sdamanager/git",
                    type: "DELETE",
                    contentType: "application/json",
                    dataType: "text",
                    data: JSON.stringify(list),
                    error: function (error) {
                        swal("server return error", "", "error");
                    },
                    success: function (data, code) {
                        if (code == "success") {
                            get_gits();
                        } else {
                            swal("server return error.");
                        }
                    }
                });
            }
            else {
                swal("server return error.");
            }
        }  
    });
}

function get_gits() {
    $("#git_tbody").empty();
    $("#git_name").val("");
    $("#git_address").val("");
    $("#textarea_yaml").val("");

    $.ajax({
        url: base_url + "/sdamanager/git",
        type: "GET",
        dataType: "json",
        error: function (error) {
            swal("server return error", "", "error");
        },
        success: function (data, code) {
            if (code == "success") {
                var list = $.parseJSON(data);
                var listLen = list.gits.length;
                for (var i = 0; i < listLen; i++) {
                    var No = i + 1;
                    $("#git_table tbody").append('<tr>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;"><img height="50" width="50" src="' + base_url + '/static/user/' + list.gits[i].img + '"></td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.gits[i].name + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.gits[i].description + '</td>'
                        + '</tr>');
                }
            } else {
                swal("server return error", "", "error");
            }
        }
    });
}

function get_yamls() {
    $("#yaml_tbody").empty();
    $("#textarea_yaml").val("");

    $.ajax({
        url: base_url + "/sdamanager/yaml",
        type: "GET",
        dataType: "json",
        error: function (error) {
            swal("server return error", "", "error");
        },
        success: function (data, code) {
            if (code == "success") {
                var list = $.parseJSON(data);
                var listLen = list.yamls.length;
                for (var i = 0; i < listLen; i++) {
                    var No = i + 1;
                    $("#yaml_table tbody").append('<tr>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;"><img height="50" width="50" src="' + base_url + '/static/user/' + list.yamls[i].img + '"></td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.yamls[i].name + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.yamls[i].description + '</td>'
                        + '</tr>');
                }


            } else {
                swal("server return error", "", "error");
            }
        }
    });
}

$(function () {
    $("#git_tbody").on("click", "tr", function (e) {
        $("tr").removeClass("active");
        $(this).addClass("active");

        git_index = parseInt($(this).find("td:eq(0)").text()) - 1;
        $("#git_name").val($(this).find("td:eq(2)").text());
        $.ajax({
            url: base_url + "/sdamanager/git",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            error: function (error) {
                swal("server return error", "", "error");
            },
            success: function (data, code) {
                if (code == "success") {
                    var list = $.parseJSON(data);
                    var repo = list.gits[git_index].git;
                    $("#git_address").val(repo);
                    var obj = new Object();
                    obj.repo = repo;
                    $.ajax({
                        type: "POST",
                        url: "/sdamanager/recipe",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        error: function (error) {
                            swal("server return error", "", "error");
                        },
                        success: function (data) {
                            $("#textarea_yaml").val($.parseJSON(data));
                        }
                    });
                } else {
                    swal("server return error.");
                }
            }
        });
    });

    $("#yaml_tbody").on("click", "tr", function (e) {
        $("tr").removeClass("active");
        $(this).addClass("active");

        yaml_index = parseInt($(this).find("td:eq(0)").text()) - 1;
        yaml_name = $(this).find("td:eq(2)").text();
        $.ajax({
            url: base_url + "/sdamanager/yaml",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            error: function (error) {
                swal("server return error", "", "error");
            },
            success: function (data, code) {
                if (code == "success") {
                    var list = $.parseJSON(data);
                    $("#textarea_yaml").val(list.yamls[yaml_index].yaml);
                } else {
                    swal("server return error.");
                }
            }
        });
    });

    $("#btn_deploy_app").click(function () {
        if ($("#git_name").val() == "") {
            swal("Please input a app name", "", "error");
            return
        }
        $.ajaxSetup({
            beforeSend: function () {
                $("div[name=loading_bar]").show();
            },
            complete: function () {
                $("div[name=loading_bar]").hide();
            }
        });
        var obj = new Object();
        obj.name = $("#git_name").val();

        obj.git = $("#git_address").val();
        obj.data = $("#textarea_yaml").val();
        $.ajax({
            url: base_url + "/sdamanager/app/install",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(obj),
            error: function (error) {
                swal("server return error", "", "error");
            },
            success: function (data, code) {
                if (code == "success") {
                    swal("Installed!", "", "success");
                    $('#dig_install').modal('toggle');
                    get_apps();
                } else {
                    swal("server return error.");
                }
            }
        });
        $.ajaxSetup({
            beforeSend: function () { },
            complete: function () { }
        });
    });

    $("#btn_deploy_group_app").click(function () {
        if ($("#git_name").val() == "") {
            swal("Please input a app name", "", "error");
            return
    }
        $.ajaxSetup({
            beforeSend: function () {
                $("div[name=loading_bar]").show();
            },
            complete: function () {
                $("div[name=loading_bar]").hide();
            }
        });
        var obj = new Object();
        obj.name = $("#git_name").val();
        obj.data = $("#textarea_yaml").val();
        $.ajax({
            url: base_url + "/sdamanager/group/deploy",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(obj),
            error: function (error) {
                swal("server return error", "", "error");
            },
            success: function (data, code) {
                if (code == "success") {
                    swal("Installed!", "", "success");
                    $('#dig_group_install').modal('toggle');
                    get_groups();
                } else {
                    swal("server return error.");
                }
            }
        });
        $.ajaxSetup({
            beforeSend: function () { },
            complete: function () { }
        });
    });

    $("#btn_install_new_app").click(function () {
        get_gits();
    });

    $("#btn_deploy_app_group").click(function () {
        get_gits();
    });

    $("#git_tbody").on("dblclick", "tr", function (e) {
        var trNum = $(this).closest('tr').prevAll().length;
        delete_git(trNum)
    });

    $("#yaml_tbody").on("dblclick", "tr", function (e) {
        $("tr").removeClass("active");
        $(this).addClass("active");
        swal("Edit/Remove will be supported!!");
    });

    $("#btn_confirm_add_new_git").click(function () {
        var obj = new Object();
        //obj.img = $("#create_new_yaml_icon").val();
        obj.img = "sample.png"
        obj.name = $("#create_new_git_name").val();
        obj.description = $("#create_new_git_description").val();
        obj.git = $("#create_new_git_address").val();

        $.ajax({
            url: base_url + "/sdamanager/git",
            type: "POST",
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify(obj),
            error: function (error) {
                swal("server return error", "", "error");
            },
            success: function (data, code) {
                if (code == "success") {
                    get_gits();
                } else {
                    swal("server return error.");
                }
            }
        });
        $.ajaxSetup({
            beforeSend: function () { },
            complete: function () { }
        });
    });
});
