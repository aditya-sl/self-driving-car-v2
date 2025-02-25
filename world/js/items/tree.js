class Tree {
	constructor(center, size, heightCoefficient = 0.3) {
		this.center = center;
		this.size = size;
		this.heightCoefficient = heightCoefficient;
		this.base = this.#generateLevel(center, size);
	}

	#generateLevel(point, size) {
		const points = [];
		const radius = size / 2;

		for (let a = 0; a < 2 * Math.PI; a += Math.PI / 16) {
			const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
			const noisyRadius = radius * lerp(0.5, 1, kindOfRandom);
			points.push(translate(point, a, noisyRadius));
		}

		return new Polygon(points);
	}

	draw(ctx, viewPoint) {
		const diff = subtract(this.center, viewPoint);
		const top = add(this.center, scale(diff, this.heightCoefficient));

		const levelCount = 7;

		for (let level = 0; level < levelCount; level++) {
			const t = level / (levelCount - 1);
			const point = lerp2D(this.center, top, t);
			const color = `rgb(30, ${lerp(50, 200, t)}, 70)`;
			const size = lerp(this.size, 40, t);
			const poly = this.#generateLevel(point, size);
			poly.draw(ctx, { fill: color, stroke: 'rgba(0,0,0,0)' });
		}
	}
}
