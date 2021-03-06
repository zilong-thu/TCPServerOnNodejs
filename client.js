var net = require('net');

var config = require('./config');

var HOST = config.host;
var PORT = config.port;

var CONCURRENCY = 100;
var REMAINING   = CONCURRENCY;


for (var i = 0; i < CONCURRENCY; i++) {
	(function(net){
		var iter = i;
		var msg  = 'client '+ iter + ' said hello.';

		var client = net.connect({
			port: PORT,
			host: HOST
		},function() { //'connect' listener
		  client.write(msg);
		});

		client.on('data', function(data) {
		    var timeToWait = (200 + Math.random() * 800 ).toFixed(0);

		  	setTimeout(function(){
		  		client.write(msg);
		  	}, timeToWait);
		});

		client.on('end', function() {
		  console.log(iter, ' disconnected from server');
		});

		client.on('error', function(error){
			REMAINING--;
		    console.log('Client ', iter, ' error occured.', ' REMAINING : ', REMAINING);
		    console.log('Error: ', error);
		});
	})(net);
}
