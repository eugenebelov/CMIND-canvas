(function() {
	var MainScene = {
		canvas: document.getElementById('mainScene'),
		canvasContext: document.getElementById('mainScene').getContext('2d'),
		counter: 3,
		points: [],

		init: function() {
			console.log("init");
			this.clickHandler = this.putPointToScene.bind(this);
			this.moveHandler = this.move.bind(this);

			this.canvas.addEventListener('click', this.clickHandler);
		},

		move: function(e) {
			console.log('move', e, this);
			this.render();
			this.drawPoint(e.layerX, e.layerY);
		},

		up: function(e) {
			console.log('up', e);
			this.canvas.removeEventListener('mousemove', this.moveHandler);
		},

		down: function(e) {
			console.log('down', e);
			this.canvas.addEventListener('mousemove', this.moveHandler);
		},

		putPointToScene: function(event) {
			if( this.counter > 0) {
				this.counter--;
				this.points.push({ x: event.layerX, y: event.layerY });
				this.drawPoint(event.layerX, event.layerY);
			} else {
					this.canvas.removeEventListener('click', this.clickHandler);

					this.canvas.addEventListener('mouseup', this.up.bind(this));
					this.canvas.addEventListener('mousedown', this.down.bind(this));
			}
		},

		render: function() {
			this.canvasContext.clearRect(0, 0, 500, 500);
			this.points.forEach(function(item) {
				this.drawPoint(item.x, item.y);
			}.bind(this))
		},

		drawPoint: function(_x, _y) {
			this.canvasContext.beginPath();
			this.canvasContext.arc(_x, _y, 11, 0, 2*Math.PI);
			this.canvasContext.stroke();
			this.canvasContext.fill();
		},

	};

	MainScene.init();
})();
