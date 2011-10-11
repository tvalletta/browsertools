var socket;
var connect = function() {
//	socket = io.connect('http://localhost:3001');
	socket = io.connect('http://10.0.0.99:3001');

	socket.on('ack', function(data) {
		console.log(data);
	});

	socket.on('vote', function(data, clientId) {
//		socket.emit('right', clientId);  //This is how to send back to the client

        Poll.vote(data.answer);
	});
};
connect();


document.addEventListener("slideleave", function(evt) {
    Poll.reset();
});

document.addEventListener("slideenter", function(evt){
    var poll = document.querySelector('.current .poll');
    console.log(poll);
    if(poll){
        socket.emit('openpoll', true);
    }
    else{
        socket.emit('openpoll', false);
    }
});

var Poll = (function() {
    var PI2 = Math.PI * 2;

    var colors = {
        'a' : 'rgb(0, 138, 53)',
        'b' : 'rgb(0, 102, 204)',
        'c' : 'rgb(255, 0, 0)',
        'd' : 'rgb(255, 211, 25)'
    };

    var results = {};

    var draw = function(canvas) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);

        var startAngle = 0;
        var total = 0;

        for (var a in results) {
            total += results[a];
        }

        for (var ans in results) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(250, 250);
            var percent = results[ans] / total;
            var endAngle = startAngle + (PI2 * percent);
            ctx.arc(250, 250, 250, startAngle, endAngle, false);
            startAngle = endAngle;
            ctx.fillStyle = colors[ans];
            ctx.fill();
            ctx.restore();
        }
    };

    return {
        bindQuestion : function(prefix, answer) {
            var thiz = this;
            var elem = document.querySelector("#" + prefix + " button");
			if (elem) {
				elem.addEventListener('click', function() {
	                var code = document.querySelector("#" + prefix + " pre").innerText;
	                try{
	                    eval(code);
	                }
	                catch(err){
	                    alert(err);
	                }
	                document.querySelector("#" + prefix + " li[rel='" + answer + "']").setAttribute("class", "correct");
	                document.querySelector('.current .pie').setAttribute("class", "pie closed");
				});
			}
        },

        vote : function(answer) {
            var canvas = document.querySelector('.current .pie:not(.closed)');
            if(canvas){
                results[answer.toLowerCase()]++;
                draw(canvas);
            }
        },

        reset : function() {
            results = {
                'a' : 0,
                'b' : 0,
                'c' : 0,
                'd' : 0
            }
        }
    }
}());
