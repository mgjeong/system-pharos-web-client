// JS for SDA Manager

var not_include_devices;
var include_devices;
var not_include_devices_nodes;
var include_devices_nodes;

var SDAManagerAddress;

function sdamanager_onLoad() {
    set_reverse_proxy();
    get_groups();
}

function set_reverse_proxy() {
    enabled = document.getElementById("sda_manager_reverse_proxy");

    $.ajax({
        url: base_url + "/sdamanager/reverseproxy",
        type: "GET",
        error: function(error) {
            swal("server return error", "", "error");
        },
        success: function(data, code) {
            if (code == "success") {
                enabled.checked = $.parseJSON(data)
            }
            else {
                swal("server return error", "", "error");
            }
        }
    });
}

function isSDAManagerAddress(){
    SDAManagerAddress = "";
    $.ajax({
        url: base_url + "/sdamanager/check/address",
        type: "GET",
        error: function(error) {
            swal("Please input SDA Manager Address!", "", "error");
        },
        success: function(data, code) {
            if (code == "success") {
                SDAManagerAddress = data;
            }
            else {
                swal("server return error", "", "error");
            }
        }
    });
}

function get_groups() {
    sda_manager_control_hide();
    $("#group_tbody").empty();

    $.ajax({
        url: base_url + "/sdamanager/groups",
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        error: function(error) {
            swal("server return error", "", "error");
        },
        success: function(data, code) {
            if (code == "success") {
                var list = $.parseJSON(data);
                var listLen = list.groups.length;
                $("#sda_manager_ip").val(list.address);
                for (var i = 0; i < listLen; i++) {
                    var No = i + 1;
                    $("#group_table tbody").append('<tr title="' + list.groups[i].id + '">'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.groups[i].name + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.groups[i].members + '</td>'
                        + '</tr>');
                }
                get_devices();
            }
            else {
                    swal("server return error", "", "error");
            }
        }
    });
}

function get_devices() {
    $("#device_tbody").empty();

    $.ajax({
        url: base_url + "/sdamanager/devices",
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        error: function(error) {
            swal("server return error", "", "error");
        },
        success: function(data, code) {
            if (code == "success") {
                var list = $.parseJSON(data);
                var listLen = list.devices.length;

                for (var i = 0; i < listLen; i++) {
                    var No = i + 1;
                    $("#device_table tbody").append('<tr title="' + list.devices[i].id + '">'
                    + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
                    + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.devices[i].name + '</td>'
                    + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.devices[i].ip + '</td>'
                    + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.devices[i].status + '</td>'
                    + '</tr>');
                }
            }
            else {
                    swal("server return error", "", "error");
            }
        }
    });
}

function get_group_devices(not_include_devices_nodes) {
    $.ajax({
        url: base_url + "/sdamanager/group/devices",
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        error: function(error) {
            swal("server return error", "", "error");
        },
        success: function(data, code) {
            if (code == "success") {
                var list = $.parseJSON(data);
                include_devices_nodes = list.devices;
                for (var i = 0; i < include_devices_nodes.length; i++) {
                    for (var j = 0; j < not_include_devices_nodes.length; j++) {
                        if (not_include_devices_nodes[j].id == include_devices_nodes[i].id){
                            not_include_devices_nodes.splice(j, 1);
                            break;
                        }
                    }
                }
                include_devices.nodes = include_devices_nodes;
                not_include_devices.nodes = not_include_devices_nodes;
                show_devices();
            }
            else {
                swal("server return error", "", "error");
            }
        }
    });
}

function show_devices(){
    $("tbody[name=not_include_device_tbody]").empty();
    $("tbody[name=include_device_tbody]").empty();
    var listLen = not_include_devices.nodes.length;

    for (var i = 0; i < listLen; i++) {
        var No = i + 1;
        $("table[name=not_include_device_table] tbody").append('<tr title="' + not_include_devices.nodes[i].id + '">'
        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + not_include_devices.nodes[i].name + '</td>'
        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + not_include_devices.nodes[i].ip + '</td>'
        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + not_include_devices.nodes[i].status + '</td>'
        + '</tr>');
    }

    listLen = include_devices.nodes.length;
    for (var i = 0; i < listLen; i++) {
        var No = i + 1;
        $("table[name=include_device_table] tbody").append('<tr title="' + include_devices.nodes[i].id + '">'
        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + include_devices.nodes[i].name + '</td>'
        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + include_devices.nodes[i].ip + '</td>'
        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + include_devices.nodes[i].status + '</td>'
        + '</tr>');
    }
}

function get_node_list(data){
    var obj = new Object();
    var arr = new Array();

    for (var i = 0; i < data.nodes.length; i++) {
        arr.push(data.nodes[i].id);
    }

    obj.nodes = arr;
    return obj;
}

$(function() {
    $("#group_tbody").on("click", "tr", function() {
        sda_manager_control_show();
        $("#device_tbody").empty();
        $("#group_name").text($(this).find("td:eq(1)").text());
        // focus clicked tr
        $("tr").removeClass("active");
        $(this).addClass("active");

        var obj = new Object();
        obj.id = $(this).attr('title');
        obj.name = $(this).find("td:eq(1)").text();
        selected_group_name = $(this).find("td:eq(1)").text();

        $.ajax({
            url: base_url + "/sdamanager/group",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(obj),
            error: function(error) {
                swal("server return error", "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    var list = $.parseJSON(data);
                    var listLen = list.devices.length;

                    for (var i = 0; i < listLen; i++) {
                        var No = i + 1;
                        $("#device_table tbody").append('<tr title="' + list.devices[i].id + '">'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.devices[i].name + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.devices[i].ip + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.devices[i].status + '</td>'
                        + '</tr>');
                    }
                }
                else {
                    swal("server return error", "", "error");
                }
            }
        });
    });

    $("#device_tbody").on("click", "tr", function() {
        var obj = new Object();

        obj.id = $(this).attr('title');
        obj.name = $(this).find("td:eq(1)").text();
        obj.ip = $(this).find("td:eq(2)").text();

        $.ajax({
            url: base_url + "/sdamanager/device",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(obj),
            error: function(error) {
                swal("server return error", "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    $(location).attr("href", data);
                }
                else {
                    swal("server return error", "", "error");
                }
            }
        });
    });

    $("#btn_set_sdam_address").click(function() {
        $("#sda_manager_section").removeClass("section_with_control")
        var obj = new Object();
        obj.ip = $("#sda_manager_ip").val();

        $.ajax({
            url: base_url + "/sdamanager/address",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(obj),
            error: function(error) {
                swal("server return error", "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    $("#sda_manager_ip").val(data);
                    swal("Connected!", "", "success");
                    get_groups();
                }
                else {
                    swal("server return error", "", "error");
                }
            }
        });
    });

    $("#sda_manager_reverse_proxy").change(function(event) {
        var obj = new Object();
        var checkbox = event.target;

        if (checkbox.checked) {
            obj.enabled = "true";
        } else {
            obj.enabled = "false";
        }

        $.ajax({
            url: base_url + "/sdamanager/reverseproxy",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(obj),
            error: function(error) {
                swal("server return error", "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    swal("Updated!", "", "success");
                }
                else {
                    swal("server return error", "", "error");
                }
            }
        });
    });

    $("#btn_show_all_device").click(function() {
        get_groups();
    });

    $("#btn_create_new_group").click(function() {
        if(SDAManagerAddress == "") return;

        not_include_devices = new Object();
        include_devices = new Object();
        not_include_devices_nodes = new Array();
        include_devices_nodes = new Array();

        include_devices.nodes = include_devices_nodes;
        not_include_devices.nodes = not_include_devices_nodes;

        $.ajax({
            url: base_url + "/sdamanager/devices",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            error: function(error) {
                swal("server return error", "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    var list = $.parseJSON(data);
                    var listLen = list.devices.length;
                    for (var i = 0; i < listLen; i++) {
                        var No = i + 1;
                        not_include_devices_nodes.push(list.devices[i]);
                    }
                    not_include_devices.nodes = not_include_devices_nodes;
                    show_devices();
                }
                else {
                    swal("server return error", "", "error");
                }
            }
        });
    });

    $("tbody[name=not_include_device_tbody]").on("dblclick", "tr", function() {
        var obj = new Object();
        obj.id = $(this).attr('title');

        for (var i = 0; i < not_include_devices.nodes.length; i++) {
            if(not_include_devices.nodes[i].id == obj.id){
                include_devices_nodes.push(not_include_devices.nodes[i]);
                not_include_devices.nodes.splice(i, 1);
                break;
            }
        }
        include_devices.nodes = include_devices_nodes;
        show_devices();
    });

    $("tbody[name=include_device_tbody]").on("dblclick", "tr", function() {
        var obj = new Object();
        obj.id = $(this).attr('title');

        for (var i = 0; i < include_devices.nodes.length; i++) {
            if(include_devices.nodes[i].id == obj.id){
                not_include_devices.nodes.push(include_devices.nodes[i]);
                include_devices.nodes.splice(i, 1);
                break;
            }
        }
        not_include_devices.nodes = not_include_devices_nodes;
        show_devices();
    });

    $("#btn_confirm_create_new_group").click(function() {
        if(SDAManagerAddress == "") return ;

        var condition = 1;
        var obj = new Object();
        obj.members = get_node_list(include_devices);
        obj.name = $("#create_new_group_name").val();

        if(obj.name == ""){
            swal("Please input a group name", "", "error");
            condition = 0;
        }

        if(obj.members.nodes.length == 0){
            swal("Please add at least one device", "", "error");
            condition = 0;
        }
        if(condition){
            $.ajax({
                url: base_url + "/sdamanager/group/create",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(obj),
                error: function(error) {
                    swal("server return error", "", "error");
                },
                success: function(data, code) {
                    if (code == "success") {
                        swal("Created!", "", "success");
                        $('#dig_create_group').modal('toggle');
                        get_groups();
                    }
                    else {
                        swal("server return error", "", "error");
                    }
                }
            });
        }
    });

    $("#btn_delete_group").click(function() {
        swal({
            title:"Are you sure?",
            text:"The group will not be able to recover this.",
            type:"warning",
            allowOutsideClick:false,
            showCancelButton: true,
            confirmButtonText:"Yes",
            confirmButtonColor: "#DD6B55",
            cancelButtonText:"No",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
            },
            function(){
                setTimeout(function(){
                    $.ajax({
                    url: base_url +"/sdamanager/group/delete",
                    type: "DELETE",
                    error: function(error) {
                        swal("server return error", "", "error");
                    },
                    success: function(data, code) {
                        if (code == "success") {
                            get_groups();
                            swal("Deleted!", "", "success");
                        } else {
                            swal("server return error", "", "error");
                        }
                    }
                });
              }, 2000);
            }
        );
    });

    $("#btn_members_group").click(function() {
        not_include_devices = new Object();
        include_devices = new Object();
        not_include_devices_nodes = new Array();
        include_devices_nodes = new Array();

        include_devices.nodes = include_devices_nodes;
        not_include_devices.nodes = not_include_devices_nodes;

        $("#members_group_name").text(" - " + selected_group_name);

        $.ajax({
            url: base_url + "/sdamanager/devices",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            error: function(error) {
                swal("server return error", "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    var list = $.parseJSON(data);
                    not_include_devices_nodes = list.devices;
                    get_group_devices(not_include_devices_nodes);
                }
                else {
                    swal("server return error", "", "error");
                }
            }
        });
    });

    $("#btn_save_group_members").click(function() {
        var condition = 1;
        var obj = new Object();
        obj = get_node_list(include_devices);

        if(obj.nodes.length == 0){
            swal("Please add at least one device", "", "error");
            condition = 0;
        }

        if(condition){
            $.ajax({
                url: base_url + "/sdamanager/group/members",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(obj),
                error: function(error) {
                    swal("server return error", "", "error");
                },
                success: function(data, code) {
                    if (code == "success") {
                        swal("Saved!", "", "success");
                        $('#dig_members_group').modal('toggle');
                        get_groups();
                    }
                    else {
                        swal("server return error", "", "error");
                    }
                }
            });
        }
    });

    $("#btn_group_app").click(function() {
        $(location).attr("href", "/app");
    });

    $("#btn_add_device").click(function() {
        if(SDAManagerAddress == "") return ;
    });
});