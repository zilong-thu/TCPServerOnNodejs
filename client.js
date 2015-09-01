var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;

var CONCURRENCY = 4500;

for (var i = 0; i < CONCURRENCY; i++) {
	(function(net){
		var iter = i;
		var msg  = 'client '+ iter + ' said hello.';

		var client = net.connect({
			port: PORT,
			host: HOST
		},function() { //'connect' listener
		  console.log('client ', iter, ' connected to server!');
		  client.write(msg);
		});

		client.on('data', function(data) {
		    console.log('Iterval ', iter, ': ', data.toString());
		    var timeToWait = (200 + Math.random() * 800 ).toFixed(0);

		  	setTimeout(function(){
		  		client.write(msg);
		  	}, timeToWait);

		});

		client.on('end', function() {
		  console.log(iter, 'disconnected from server');
		});
	})(net);
<<<<<<< HEAD
}
=======
}
>>>>>>> 38446522421ee64dd853c5f57805b1909e329053
