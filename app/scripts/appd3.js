(function() {
	var MainScene = {
		canvas: d3.select('#mainCanvas'),
		canvasNode: d3.select('#mainCanvas')[0][0],
		drag: d3.behavior.drag(),
		counter: 3,
		points: [],

		init: function() {
			console.log("init");
			this.clickHandler = this.putPointToScene.bind(this);

			this.canvas.on('click', this.clickHandler);

		},

		putPointToScene: function(event) {
			if(d3.event.target == this.canvasNode) {
				// this.drawPoint(d3.event.offsetX, d3.event.offsetY);
				if( this.counter > 0) {
					this.counter--;
					this.points.push({ x: d3.event.offsetX, y: d3.event.offsetY });

				// 	this.drawPoint(event.layerX, event.layerY);
				}
				else {
						// this.canvas.off('click', this.clickHandler);
						this.drawPoly()
						// console.log(this.points);

				}
			}
		},

		drawPoint: function(_x, _y) {
			this.canvas
					.append("circle")
					.attr("point", this.counter)
					.attr("cx", _x)
					.attr("cy", _y)
					.attr("r", 11);
		},

		drawPoly: function(points) {
			var coords = this.convertCoordsToPoly(this.points);
			console.log('lolol', coords);

			// this.canvas
			// 		.append("polygon")
			// 		.attr('stroke', 'blue')
			// 		.attr('stroke-width', '2')
			// 		.attr("points", points);
		},

		convertCoordsToPoly: function(coords) {
			var result = "";

			result = _.map(coords, function(item) {
				var val = _.values(item);
				return result += (val + " ");
			});
			console.log(result);

			return result;
		}
	};

	MainScene.init();
})(_);
