var idx = 0;
var color = ['a','b','c','d']
$(document).ready(function (){
    var socket = io.connect("http://" + document.domain + ":" + location.port);
    console.log(socket)
    socket.on('push', function(data){
        $.toast.config.align = 'right';
        $.toast.config.width = 400;
        $.toast(data.image+" is update", {
            duration: 2000,
            //sticky: true,
            type: color[idx]
        });
        idx++
        idx%=4
    });
});