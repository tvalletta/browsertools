var debug = (function() {
	var outer = 'closure scope';
	
	function breakme(a, b, c, d, e, f) {
		// Come to our JSPuzzlers Talk!
		var x = +d+ +b+ +c.three;
		console.log(x);
	}
	
	return {
		run: function() {
			breakme("one", 2, {three: 3}, [4], breakme, document.getElementById('debugme'));
		}
	}
})();