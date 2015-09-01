var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;

var CONCURRENCY = 5000;
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
		    // console.log('Iterval ', iter, ': ', data.toString());
		    var timeToWait = (200 + Math.random() * 800 ).toFixed(0);

		  	setTimeout(function(){
		  		client.write(msg);
		  	}, timeToWait);
		});

		client.on('end', function() {
		  console.log(iter, 'disconnected from server');
		});

		client.on('error', function(error){
			REMAINING--;
		    console.log('Client ', iter, ' error occured.');
		    console.log('REMAINING : ', REMAINING);
		});
	})(net);
}