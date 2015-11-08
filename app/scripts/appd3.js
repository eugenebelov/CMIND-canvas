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
		resizedCoords: [],

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
										var obj = d3.select(this.draggedObject);
										obj.attr("cx", (d3.event.x))
												.attr("cy", (d3.event.y));

										this.updateVerticle(d3.event.x, d3.event.y);

										if(this.points.length > 3) this.updateRectangle(obj);

							    }.bind(this))
						    .on("dragend", function(d) {

									this.points = this.resizedCoords;
									this.draggedObject = null;
									this.isDraggind = false;

							    }.bind(this))
		},

		updateRectangle: function(obj) {
			var index = Math.floor(obj.attr('data')),
					arr = [];

			arr[0] = ( (index - 1 < 0) ? this.points[3] : this.points[index - 1]);
			arr[1] = ({ x: Math.floor(obj.attr('cx')), y: Math.floor(obj.attr('cy'))});
			arr[2] = ( (index + 1 > this.points.length - 1) ? this.points[0] : this.points[index + 1]);
			arr[3] = this.calculateFourthPoint(arr);

			arr.forEach(function(pt, index) {
				var id = d3.select('#verticle' + index);

				id.attr('cx', Math.floor(pt.x));
				id.attr('cy', Math.floor(pt.y));

			}.bind(this))

			this.drawPoly(arr)
					.drawCircle();

			this.resizedCoords = arr;

			return this;
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
							newpoint = this.calculateFourthPoint(this.points);

					coords.push(newpoint);
					this.drawPoint(newpoint.x, newpoint.y)
							.addVerticle(newpoint.x, newpoint.y)
							.drawPoly(coords)
							.drawCircle();

					console.log(this.points);
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

			this.points[id].x = Math.floor(_x);
			this.points[id].y = Math.floor(_y);

			return this;
		},

		drawPoint: function(_x, _y) {
			this.canvas
					.append("circle")
					.attr('id', 'verticle' + this.counter)
					.attr('data', this.points.length)
					.attr('fill', 'rgba(128, 0, 128, 0)')
					.attr('stroke', 'blue')
					.attr('stroke-width', '1')
					.attr("cx", _x)
					.attr("cy", _y)
					.attr("r", 11)
					.call(this.drag);

			return this;
		},

		drawPoly: function(points) {
			var coords = this.convertCoordsToPoly(points);

			d3.select('#paralelogram').remove();

			this.canvas
					.append("polygon")
					.attr('id', 'paralelogram')
					.attr('fill', 'rgba(128, 0, 128, 0)')
					.attr('stroke', 'blue')
					.attr('stroke-width', '2')
					.attr("points", coords);

			return this;
		},

		drawCircle: function() {
			var r = this.areaRect().r,
					center = this.areaRect().center;

			d3.select('#circleOutside').remove();

			this.canvas
					.append("circle")
					.attr('id', 'circleOutside')
					.attr('fill', 'rgba(128, 0, 128, 0)')
					.attr('stroke', 'blue')
					.attr('stroke-width', '1')
					.attr("cx", center.x)
					.attr("cy", center.y)
					.attr("r", r);

			return this;
		},

		areaRect: function() {
			var a = Math.floor(Math.sqrt( Math.pow(this.points[1].x - this.points[0].x, 2) + Math.pow(this.points[1].y - this.points[0].y, 2) )),
					b = Math.floor(Math.sqrt( Math.pow(this.points[2].x - this.points[1].x, 2) + Math.pow(this.points[2].y - this.points[1].y, 2) )),
					c = Math.floor(Math.sqrt( Math.pow(this.points[2].x - this.points[0].x, 2) + Math.pow(this.points[2].y - this.points[0].y, 2) )),
					p = (a + b + c) /2,
					area = Math.floor( Math.sqrt( p*(p - a)*(p - b)*(p - c))) *2;

			var cx, cy;
			var x1 = this.points[2].x,
					x2 = this.points[0].x,
					y1 = this.points[2].y,
					y2 = this.points[0].y;

			if( x2 > x1) cx = x1 + (x2 - x1) /2
			if( x2 < x1) cx = x2 + (x1 - x2) /2
			if( x2 == x1) cx = x2

			if( y2 > y1) cy = y1 + (y2 - y1) /2
			if( y2 < y1) cy = y2 + (y1 - y2) /2
			if( y2 == y1) cy = y2

			var circleRadius = Math.floor( Math.sqrt( area / Math.PI ));

			return {
				r: circleRadius,
				center: {
					x: cx,
					y: cy
				}
			};
		},

		convertCoordsToPoly: function(coords) {
			var result = "";

			_.each(coords, function(item) {
				var val = _.values(item);
				result += (val + " ");
			});

			return result;
		},

		calculateFourthPoint: function(points) {

			var _x1 = (points[0].x + points[2].x) / 2,
					_y1 = (points[0].y + points[2].y) / 2,
					_x2 = _x1*2 - points[1].x,
					_y2 = _y1*2 - points[1].y;

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
