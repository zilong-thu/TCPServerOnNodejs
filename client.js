var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;

var client = net.connect({
	port: PORT,
	host: HOST
},function() { //'connect' listener
  console.log('connected to server!');
  client.write('world!\r\n');
});

client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});

client.on('end', function() {
  console.log('disconnected from server');
});