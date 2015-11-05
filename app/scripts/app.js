(function() {
	var MainScene = {
		canvas: document.getElementById('mainScene'),
		canvasContext: document.getElementById('mainScene').getContext('2d'),

		init: function() {
				this.canvas.addEventListener('click', this.putPointToScene.bind(this), false);
		},

		putPointToScene: function(event) {
			this.drawPoint(event.layerX, event.layerY)
		},

		drawPoint: function(_x, _y) {
			this.canvasContext.beginPath();
			this.canvasContext.arc(_x, _y, 11, 0, 2*Math.PI);
			this.canvasContext.stroke();
		},

	};

	MainScene.init();
})();
