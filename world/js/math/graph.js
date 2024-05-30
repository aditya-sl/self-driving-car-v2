class Graph {
	constructor(points = [], segments = []) {
		this.points = points;
		this.segments = segments;
	}

	static load(info) {
		const points = info.points.map((p) => new Point(p.x, p.y));
		const segments = info.segments.map(
			(s) =>
				new Segment(
					points.find((p) => p.equals(s.p1)),
					points.find((p) => p.equals(s.p2))
				)
		);

		return new Graph(points, segments);
	}

	hash() {
		return JSON.stringify(this);
	}

	addPoint(point) {
		this.points.push(point);
	}

	containsPoint(point) {
		return this.points.find((p) => p.equals(point));
	}

	tryAddPoint(point) {
		if (!this.containsPoint(point)) {
			this.addPoint(point);
			return true;
		}

		return false;
	}

	removePoint(point) {
		const segs = this.getSegmentsWithPoint(point);
		for (const seg of segs) {
			this.removeSegment(seg);
		}
		this.points.splice(this.points.indexOf(point), 1);
	}

	addSegment(segment) {
		this.segments.push(segment);
	}

	containsSegment(segment) {
		return this.segments.find((s) => s.equals(segment));
	}

	tryAddSegment(segment) {
		if (!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
			this.addSegment(segment);
			return true;
		}

		return false;
	}

	removeSegment(seg) {
		this.segments.splice(this.segments.indexOf(seg), 1);
	}

	getSegmentsWithPoint(point) {
		const segs = [];
		for (const seg of this.segments) {
			if (seg.includes(point)) {
				segs.push(seg);
			}
		}
		return segs;
	}

	dispose() {
		this.points = [];
		this.segments = [];
	}

	draw(ctx) {
		for (const seg of this.segments) {
			seg.draw(ctx);
		}

		for (const point of this.points) {
			point.draw(ctx);
		}
	}
}
