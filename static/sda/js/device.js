// JS for SDA Manager device

function device_onLoad() {
    get_apps();
}

function get_apps() {
    sda_manager_control_hide();
    $("#app_tbody").empty();
    $("#service_tbody").empty();

    $.ajax({
        url: base_url +"/sdamanager/apps",
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        error: function(error) {
            swal("Server return error", "", "error");
        },
        success: function(data, code) {
            if (code == "success") {
                var list = $.parseJSON(data);
                var listLen = list.apps.length;
                $("#device_info").text(list.device);
                for (var i = 0; i < listLen; i++) {
                    var No = i + 1;
                    $("#app_table tbody").append('<tr title="' + list.apps[i].id + '">'
                    + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
                    + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.apps[i].name + '</td>'
                    + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.apps[i].services + '</td>'
                    + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.apps[i].state + '</td>'
                    + '</tr>');
                }
            } else {
                swal("Server return error", "", "error");
            }
        }
    });
}

$(function() {
    $("#app_tbody").on("click", "tr", function(e) {
        sda_manager_control_show();
        $("#service_tbody").empty();
        $("tr").removeClass("active");
        $(this).addClass("active");
        $("#git_name").text($(this).find("td:eq(1)").text());

        var obj = new Object();
        obj.id = $(this).attr('title');
        $.ajax({
            url: base_url +"/sdamanager/app",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(obj),
            error: function(error) {
                swal("Server return error",  "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    var list = $.parseJSON(data);
                    var listLen = list.services.length;
                    for (var i = 0; i < listLen; i++) {
                        var No = i + 1;
                        $("#service_table tbody").append('<tr>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + No + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.services[i].name + '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.services[i].state+ '</td>'
                        + '<td align="center" class="table_sda" style="vertical-align: middle;">' + list.services[i].exitcode + '</td>'
                        + '</tr>');
                    }
                } else {
                    swal("Server return error", "", "error");
                }
            }
        });
    });

    $('#btn_delete_app').click(function(){
        swal({
            title:"Are you sure?",
            text:"The app will not be able to recover this.",
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
                    url: base_url +"/sdamanager/app",
                    type: "DELETE",
                    error: function(error) {
                        swal("Server return error", "", "error");
                    },
                    success: function(data, code) {
                        if (code == "success") {
                            get_apps();
                            swal("Deleted!", "", "success");
                        } else {
                            swal("Server return error", "", "error");
                        }
                    }
                });
              }, 2000);
            }
        );
    });

    $("#btn_update_app").click(function() {
        swal({
            title:"Do you want to update?",
            text:"It only supports latest tag",
            type:"info",
            allowOutsideClick:false,
            showCancelButton: true,
            confirmButtonText:"Yes",
            cancelButtonText:"No",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
            },
            function(){
                setTimeout(function(){
                    $.ajax({
                        url: base_url +"/sdamanager/app/update",
                        type: "GET",
                        error: function(error) {
                            swal("Server return error", "", "error");
                        },
                        success: function(data, code) {
                            if (code == "success") {
                                get_apps();
                                swal("Updated!", "", "success");
                            } else {
                                swal("Server return error", "", "error");
                            }
                        }
                    });
                }, 2000);
            }
        );
    });

    $("#btn_start_app").click(function() {
        swal({
            title:"Do you want to start?",
            type:"info",
            allowOutsideClick:false,
            showCancelButton: true,
            confirmButtonText:"Yes",
            cancelButtonText:"No",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
            },
            function(){
                setTimeout(function(){
                    $.ajax({
                        url: base_url +"/sdamanager/app/start",
                        type: "GET",
                        error: function(error) {
                            swal("Server return error", "", "error");
                        },
                        success: function(data, code) {
                            if (code == "success") {
                                get_apps();
                                swal("Started!", "", "success");
                            } else {
                                swal("Server return error", "", "error");
                            }
                        }
                    });
                }, 2000);
            }
        );
    });

    $("#btn_stop_app").click(function() {
        swal({
            title:"Do you want to stop?",
            type:"info",
            allowOutsideClick:false,
            showCancelButton: true,
            confirmButtonText:"Yes",
            cancelButtonText:"No",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
            },
            function(){
                setTimeout(function(){
                    $.ajax({
                        url: base_url +"/sdamanager/app/stop",
                        type: "GET",
                        error: function(error) {
                            swal("Server return error", "", "error");
                        },
                        success: function(data, code) {
                            if (code == "success") {
                                get_apps();
                                swal("Stopped!", "", "success");
                            } else {
                                swal("Server return error", "", "error");
                            }
                        }
                    });
                }, 2000);
            }
        );
    });

    $("#btn_update_YAML").click(function() {
        $.ajax({
            url: base_url +"/sdamanager/app/yaml",
            type: "GET",
            error: function(error) {
                swal("Server return error", "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    var obj = $.parseJSON(data);
                    obj = $.parseJSON(obj);
                    $("#textarea_update_yaml").val(obj);
                
                } else {
                    swal("Server return error", "", "error");
                }
            }
        });
    });

    $("#btn_confirm_update_YAML").click(function() {
        if ($("#textarea_update_new_yaml").val() == "") {
            swal("Please input a new yaml", "", "error");
            return;
        }
        var obj = new Object();
        obj.data = $("#textarea_update_new_yaml").val();
        swal({
            title:"Do you want to update YAML?",
            type:"info",
            allowOutsideClick:false,
            showCancelButton: true,
            confirmButtonText:"Yes",
            cancelButtonText:"No",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
            },
            function(){
                setTimeout(function(){
                    $.ajax({
                        url: base_url +"/sdamanager/app/yaml",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        error: function(error) {
                            swal("Server return error", "", "error");
                        },
                        success: function(data, code) {
                            if (code == "success") {
                                swal("Updated!", "", "success");
                                $('#dig_update_YAML').modal('toggle');
                            } else {
                                alert("Server return error.");
                            }
                        }
                    });
                }, 2000);
            }
        );
    });

    $("#btn_confirm_get_YAML").click(function(){
        var repo=$('#new_git_address').val();
        
        if(repo.match('github.sec.samsung.net/')){ //samsung github
            var repo_split=repo.split("github.sec.samsung.net/");
            var obj = new Object();
            obj.repo = repo_split[1];
            $.ajax({
                type: "POST",
                url: "/sdamanager/git/clone",
                contentType: "application/json",
                data: JSON.stringify(obj),
                error: function(error) {
                    swal("server return error", "", "error");
                },
                success: function(data){
                    data=$.parseJSON(data)
                    $("#textarea_update_new_yaml").val(data);
                }
            });
        }
        else{ //public github
            var repo_split = repo.split("github.com/");
            $.ajax({
                url: "https://raw.githubusercontent.com/"+repo_split[1]+"/master/docker-compose.yml",
                type: "GET",
                error: function(error) {
                    swal("Server return error", "", "error");
                },
                success: function(data){
                    $("#textarea_update_new_yaml").val(data);
                }
            });
        }
    });

    $("#btn_edit_device").click(function(){
        $.ajax({
            url: base_url + "/sdamanager/device/info",
            type: "GET",
            error: function(error) {
                swal("Server return error", "", "error");
            },
            success: function(data, code) {
                if(code == "success") {
                    var obj = $.parseJSON(data);
                    $("#edit_device_name").val(obj.name);
                    $("#edit_device_interval").val(obj.pinginterval);
                }
                else {
                    swal("Server return error", "", "error");
                }
            }
        })
    });

    $("#btn_resource").click(function(){
        $.ajax({
            url: base_url +"/sdamanager/monitoring/resource",
            type: "GET",
            error: function(error) {
                swal("Server return error", "", "error");
            },
            success: function(data, code) {
                if (code == "success") {
                    var obj = Object();
                    obj = $.parseJSON(data);
                    var cpuNum = obj.cpu.length;
                    $("#cpu_tbody").empty();
                    for(var i = 0; i < cpuNum; i++) {
                        $("#cpu_tbody").append('<tr>'
                        + '<td align="left" class="table_sda">' + (i+1) + '</td>'
                        + '<td align="right" class="table_sda">' + obj.cpu[i] + '</td>'
                        + '</tr>'); 
                    }

                    $("#mem_tbody").empty();
                    $("#mem_tbody").append('<tr>'
                    + '<td align="left" class="table_sda">' + "free :" + '</td>'
                    + '<td align="right" class="table_sda">' + obj.mem.free + '</td>'
                    + '</tr>'); 
                    $("#mem_tbody").append('<tr>'
                    + '<td align="left" class="table_sda">' + "total :" + '</td>'
                    + '<td align="right" class="table_sda">' + obj.mem.total + '</td>'
                    + '</tr>'); 
                    $("#mem_tbody").append('<tr>'
                    + '<td align="left" class="table_sda">' + "used :" + '</td>'
                    + '<td align="right" class="table_sda">' + obj.mem.used + '</td>'
                    + '</tr>'); 
                    $("#mem_tbody").append('<tr>'
                    + '<td align="left" class="table_sda">' + "usedpercent :" + '</td>'
                    + '<td align="right" class="table_sda">' + obj.mem.usedpercent + '</td>'
                    + '</tr>'); 
                    
                    var diskNum = obj.disk.length;
                    $("#disk_tbody").empty();
                    for(var i = 0; i < diskNum; i++){
                        $("#disk_tbody").append('<tr>'
                        + '<td class="table_sda" rowspan=5 valign="top">'+(i+1)+'</td>'
                        + '<td align="left" class="table_sda">' + "free :" + '</td>'
                        + '<td align="right" class="table_sda">' + obj.disk[i].free + '</td>'
                        + '</tr>'); 
                        $("#disk_tbody").append('<tr>'
                        + '<td align="left" class="table_sda">' + "path :" + '</td>'
                        + '<td align="right" class="table_sda">' + obj.disk[i].path + '</td>'
                        + '</tr>'); 
                        $("#disk_tbody").append('<tr>'
                        + '<td align="left" class="table_sda">' + "total :" + '</td>'
                        + '<td align="right" class="table_sda">' + obj.disk[i].total + '</td>'
                        + '</tr>'); 
                        $("#disk_tbody").append('<tr>'
                        + '<td align="left" class="table_sda">' + "used :" + '</td>'
                        + '<td align="right" class="table_sda">' + obj.disk[i].used + '</td>'
                        + '</tr>'); 
                        $("#disk_tbody").append('<tr>'
                        + '<td align="left" class="table_sda">' + "usedpercent :" + '</td>'
                        + '<td align="right" class="table_sda">' + obj.disk[i].usedpercent + '</td>'
                        + '</tr>'); 
                    }
                } else {
                    swal("Server return error", "", "error");
                }
            }
        })
    });

    $("#btn_confirm_edit_device").click(function(){
        var props = '{"properties":[{"devicename":"'+ $("#edit_device_name").val() +'"},{"pinginterval":"'+$("#edit_device_interval").val()+'"}]}';
        var obj = Object();
        obj = JSON.parse(props);

        swal({
            title:"Do you want to edit Device Info?",
            type:"info",
            allowOutsideClick:false,
            showCancelButton: true,
            confirmButtonText:"Yes",
            cancelButtonText:"No",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
            },
            function(){
                setTimeout(function(){
                    $.ajax({
                        url: base_url +"/sdamanager/device/info",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        error: function(error) {
                            swal("Server return error", "", "error");
                        },
                        success: function(data, code) {
                            if (code == "success") {
                                swal("Update Device Info!", "", "success");
                                $('#dig_edit_device').modal('toggle');
                                get_apps();
                            } else {
                                alert("Server return error.");
                            }
                        }
                    });
                }, 2000);
            
            }
        );
    });

    $("#btn_delete_device").click(function() {
        var isSuccess = false;
        swal({
            title:"Do you want to unregister this device?",
            type:"info",
            allowOutsideClick:false,
            showCancelButton: true,
            confirmButtonText:"Yes",
            cancelButtonText:"No",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
            },
            function(){
                setTimeout(function(){
                    $.ajax({
                        url: base_url +"/sdamanager/unregister",
                        type: "POST",
                        error: function(error) {
                            swal("Server return error", "", "error");
                        },
                        success: function(data, code) {
                            if (code == "success") {

                                swal({
                                    title:"Unregister!",
                                    type:"success",
                                    allowOutsideClick:false,
                                    confirmButtonText:"Ok",
                                    closeOnConfirm: false,
                                    },
                                    function(){
                                        setTimeout(function(){
                                            $(location).attr("href", "/sdamanager");
                                        }, 0);
                                    }
                                );
                            }
                        }
                    });

                }, 2000);
            }
        );
    });
});
