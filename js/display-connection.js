var socket2,
	server2 = 'http://127.0.0.1:3009';

var connect = function(callback) {
	console.log("Attempting to connect to " + server2);
	socket2 = io.connect(server2);
	socket2.on('ack', function() {
		if (callback) callback();
	});
	socket2.on('score', function(totals) {
		var val = totals.pos - totals.neg;
		var max = totals.cnt * 2;
		var pos = (((val / max) * 100) << 0);
		scale.moveTo(pos);
	});
};
