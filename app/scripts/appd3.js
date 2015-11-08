(function() {
	var MainScene = {
		canvas: d3.select('#mainCanvas'),
		resetButton: d3.select('#resetButton'),
		canvasNode: d3.select('#mainCanvas')[0][0],
		drag: d3.behavior.drag(),
		counter: 3,
		isDraggind: false,
		draggedObject: null,
		points: [],

		init: function() {
			console.log("init");
			this.setVerticleHandler = this.putPointToScene.bind(this);
			this.setResetHandler = this.resetSvgCanvas.bind(this);

			this.canvas.on('mousedown', this.setVerticleHandler);
			this.resetButton.on('click', this.setResetHandler);

			var that = this;
			this.drag.on("dragstart", function() {
										d3.event.sourceEvent.stopPropagation();
										this.draggedObject = d3.selectAll(d3.event.sourceEvent.target)[0];
										this.isDraggind = true;
							    }.bind(this))
						    .on("drag", function() {
										d3.select(this.draggedObject)
						                .attr("cx", (d3.event.x))
						                .attr("cy", (d3.event.y));
										this.updateVerticle(d3.event.x, d3.event.y);
							    }.bind(this))
						    .on("dragend", function(d) {
											this.draggedObject = null;
											this.isDraggind = false;
							    }.bind(this))
		},

		putPointToScene: function(event) {
			if(d3.event.target == this.canvasNode) {
				if(this.counter > 0) {

					this.drawPoint(d3.event.offsetX, d3.event.offsetY)
							.addVerticle(d3.event.offsetX, d3.event.offsetY);

					this.counter--;
				}
				else {
					var coords = this.points.slice(),
							newpoint = this.calculateFourthPoint();

					coords.push(newpoint);
					this.drawPoint(newpoint.x, newpoint.y)
							.drawPoly(coords);
				}
			} else {

			}
		},

		addVerticle: function(_x, _y) {
			this.points.push({ x: _x, y: _y });

			return this;
		},

		updateVerticle: function(_x, _y) {
			var id = d3.select(this.draggedObject).attr('data');

			this.points[id].x = _x;
			this.points[id].y = _y;

			console.log("update", this.convertCoordsToPoly(this.points));
		},

		drawPoint: function(_x, _y) {
			this.canvas
					.append("circle")
					.attr('id', 'verticle' + this.counter)
					.attr('data', this.points.length)
					.attr("fill", "blue")
					.attr("cx", _x)
					.attr("cy", _y)
					.attr("r", 11)
					.call(this.drag);

			return this;
		},

		drawPoly: function(points) {
			var coords = this.convertCoordsToPoly(points);

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

		calculateFourthPoint: function() {
			var _x1 = (this.points[0].x + this.points[2].x) / 2,
					_y1 = (this.points[0].y + this.points[2].y) / 2,
					_x2 = _x1*2 - this.points[1].x,
					_y2 = _y1*2 - this.points[1].y;

			return {
				x: _x2,
				y: _y2
			};
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
