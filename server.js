var net = require('net');
var moment = require('moment');

var HOST = '127.0.0.1';
var PORT = 5001;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
var server = net.createServer(function(sock) {

    var remoteAddress = sock.remoteAddress;
    var remotePort    = sock.remotePort;

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    // console.log('CONNECTED: ' + remoteAddress + ':' + remotePort);

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        // console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ', ' + remoteAddress + ': ' +  remotePort + ' : ' + data);

        // 过若干时间后回发该数据，客户端将收到来自服务端的数据
        setTimeout(function(){
            sock.write('Data : "' + data + '"');
        }, 100);
    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            remoteAddress + ' ' + remotePort);
    });

    sock.on('error', function(error){
        console.log('Error occured.');
    });

});

server.listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);


// sample: 取样，每隔一定的时间（秒级），将当前的有效长连接的数量统计一下并输出
function sample(){
    setTimeout(function(){
        server.getConnections(function(err, count){
            if (err) {

            }else{
                console.log('Current connections count: ', count);
                sample();
            }
        });
    }, 2000);
}

sample();