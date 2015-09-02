var net = require('net');

// var HOST = '192.16';
var HOST = '192.168.1.21';
var PORT = 5001;

var CONCURRENCY = 4;
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
