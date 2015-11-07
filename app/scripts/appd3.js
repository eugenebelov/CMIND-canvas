(function() {
	var MainScene = {
		canvas: d3.select('#mainCanvas'),
		resetButton: d3.select('#resetButton'),
		canvasNode: d3.select('#mainCanvas')[0][0],
		drag: d3.behavior.drag(),
		counter: 3,
		points: [],

		init: function() {
			console.log("init");
			this.setVerticleHandler = this.putPointToScene.bind(this);
			this.setResetHandler = this.resetSvgCanvas.bind(this);

			this.canvas.on('click', this.setVerticleHandler);
			this.resetButton.on('click', this.setResetHandler);
		},

		putPointToScene: function(event) {
			if(d3.event.target == this.canvasNode) {
				if( this.counter > 0) {
					this.counter--;
					this.points.push({ x: d3.event.offsetX, y: d3.event.offsetY });

					this.drawPoint(d3.event.offsetX, d3.event.offsetY);
				}
				else {
					this.canvas.on('click', null);
					this.drawPoly();
				}
			}
		},

		drawPoint: function(_x, _y) {
			this.canvas
					.append("circle")
					.attr("cx", _x)
					.attr("cy", _y)
					.attr("r", 11);
		},

		drawPoly: function(points) {
			var coords = this.convertCoordsToPoly(this.points);
			console.log('lolol', coords);

			this.canvas
					.append("polygon")
					.attr('stroke', 'blue')
					.attr('stroke-width', '2')
					.attr("points", coords);
		},

		convertCoordsToPoly: function(coords) {
			var result = "";

			_.each(coords, function(item) {
				var val = _.values(item);
				result += (val + " ");
			});

			return result;
		},

		resetSvgCanvas: function() {
			console.log("reset");
			this.counter = 3;
			this.points = [];
			this.canvas.on('click', this.setVerticleHandler);
			d3.selectAll('svg > *').remove();
		}
	};

	MainScene.init();
})(_);
