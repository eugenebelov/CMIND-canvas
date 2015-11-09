(function() {
	var MainScene = {
		canvas: d3.select('#mainCanvas'),
		resetButton: d3.select('#resetButton'),
		aboutButton: d3.select('#aboutButton'),
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
			this.setAboutHandler = this.showAbout.bind(this);

			this.canvas.on('mousedown', this.setVerticleHandler);
			this.resetButton.on('click', this.setResetHandler);
			this.aboutButton.on('click', this.setAboutHandler);

			this.canvas.append("g");

			this.drag.on("dragstart", this.onDragVerticleStart.bind(this))
						    .on("drag", this.onDragVerticle.bind(this))
						    .on("dragend", this.onDragVerticleEnd.bind(this))
		},

		onDragVerticleStart: function() {
			d3.event.sourceEvent.stopPropagation();
			this.draggedObject = d3.selectAll(d3.event.sourceEvent.target)[0];
			this.isDraggind = true;
		},

		onDragVerticle: function() {
			var obj = d3.select(this.draggedObject);
			obj.attr("cx", (d3.event.x))
					.attr("cy", (d3.event.y));

			this.updateVerticle(d3.event.x, d3.event.y);

			if(this.points.length > 3) {
				this.updateRectangle(obj);

				this.resizedCoords.forEach(function(pt, index) {
					var id = d3.select('#verticle' + index);

					id.attr('cx', Math.floor(pt.x));
					id.attr('cy', Math.floor(pt.y));

				}.bind(this));
			}
		},

		onDragVerticleEnd: function() {
			if(this.resizedCoords.length > 0) {

				this.resizedCoords.forEach(function(pt, index) {
					var id = d3.select('#verticle' + index);

					id.attr('id', 'verticle' + index)
					id.attr('data', index)
					id.attr('cx', Math.floor(pt.x));
					id.attr('cy', Math.floor(pt.y));

				}.bind(this));

				this.points = this.resizedCoords;
			}
			this.draggedObject = null;
			this.isDraggind = false;
		},

		updateRectangle: function(obj) {
			var index = Math.floor(obj.attr('data')),
					arr = [];

			arr[0] = ( (index - 1 < 0) ? this.points[3] : this.points[index - 1]);
			arr[1] = ({ x: Math.floor(obj.attr('cx')), y: Math.floor(obj.attr('cy'))});
			arr[2] = ( (index + 1 > this.points.length - 1) ? this.points[0] : this.points[index + 1]);
			arr[3] = this.calculateFourthPoint(arr);

			this.drawPoly(arr)
					.drawCircle(arr);

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

					if(this.points.length >= 4) return;

					var coords = this.points.slice(),
							newpoint = this.calculateFourthPoint(this.points);

					coords.push(newpoint);
					this.drawPoint(newpoint.x, newpoint.y)
							.addVerticle(newpoint.x, newpoint.y)
							.drawPoly(coords)
							.drawCircle(coords);

					console.log(this.points, this.counter);
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
			this.canvas.selectAll('g')
							.append("circle")
								.attr('id', 'verticle' + this.counter)
								.attr('data', this.points.length)
								.attr('fill', '#B30000')
								.attr('stroke', '#B30000')
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
					.insert("polygon", 'g')
					.attr('id', 'paralelogram')
					.attr('fill', 'rgba(0, 0, 0, 0)')
					.attr('stroke', '#0066FF')
					.attr('stroke-width', '2')
					.attr("points", coords);

			return this;
		},

		drawCircle: function(coords) {
			var r = this.areaRect(coords).r,
					center = this.areaRect(coords).center;

			d3.select('#circleOutside').remove();

			this.canvas
					.insert("circle", 'g')
					.attr('id', 'circleOutside')
					.attr('fill', 'rgba(0, 0, 0, 0)')
					.attr('stroke', '#E6B800')
					.attr('stroke-width', '2')
					.attr("cx", center.x)
					.attr("cy", center.y)
					.attr("r", r);

			return this;
		},

		areaRect: function(_points) {
			var a = Math.floor(Math.sqrt( Math.pow(_points[1].x - _points[0].x, 2) + Math.pow(_points[1].y - _points[0].y, 2) )),
					b = Math.floor(Math.sqrt( Math.pow(_points[2].x - _points[1].x, 2) + Math.pow(_points[2].y - _points[1].y, 2) )),
					c = Math.floor(Math.sqrt( Math.pow(_points[2].x - _points[0].x, 2) + Math.pow(_points[2].y - _points[0].y, 2) )),
					p = (a + b + c) /2,
					area = Math.floor( Math.sqrt( p*(p - a)*(p - b)*(p - c))) *2;

			var cx, cy;
			var x1 = _points[2].x,
					x2 = _points[0].x,
					y1 = _points[2].y,
					y2 = _points[0].y;

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

		showAbout: function() {
			var about = d3.select('.about');
			about.classed('in', !about.classed('in'));
		},

		resetSvgCanvas: function() {
			console.log("reset");
			this.counter = 3;
			this.points = [];
			this.resizedCoords = [];
			this.draggedObject = null;

			d3.selectAll('svg > *')
					.transition()
						.delay('400')
						.style("opacity", "0")
					.remove();

			this.canvas.on('mousedown', this.setVerticleHandler);
			this.canvas.append("g");
		}
	};

	MainScene.init();
})(_);
