(function() {
	var MainScene = {
		canvas: document.getElementById('mainScene'),
		canvasContext: document.getElementById('mainScene').getContext('2d'),
		counter: 3,

		init: function() {
				this.canvas.addEventListener('click', this.putPointToScene.bind(this), false);
		},

		putPointToScene: function(event) {
			if( this.counter > 0) {
				this.counter--
				this.drawPoint(event.layerX, event.layerY)
			} else {
				console.warn("Oops, 3 points already here!");
			}
		},

		drawPoint: function(_x, _y) {
			this.canvasContext.beginPath();
			this.canvasContext.arc(_x, _y, 11, 0, 2*Math.PI);
			this.canvasContext.stroke();
		},

	};

	MainScene.init();
})();
