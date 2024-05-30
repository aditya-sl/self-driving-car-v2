myCanvas.width = 600;
myCanvas.height = 530;

const ctx = myCanvas.getContext('2d');

const worldString = localStorage.getItem('world');
const worldInfo = worldString ? JSON.parse(worldString) : null;
let world = worldInfo ? World.load(worldInfo) : new World(new Graph());
const graph = world.graph;
const viewport = new Viewport(myCanvas, world.zoom, world.offset);

const tools = {
	graph: { button: graphBtn, editor: new GraphEditor(viewport, graph) },
	stop: { button: stopBtn, editor: new StopEditor(viewport, world) },
	crossing: {
		button: crossingBtn,
		editor: new CrossingEditor(viewport, world),
	},
	start: { button: startBtn, editor: new StartEditor(viewport, world) },
	parking: { button: parkingBtn, editor: new ParkingEditor(viewport, world) },
	light: { button: lightBtn, editor: new LightEditor(viewport, world) },
	target: { button: targetBtn, editor: new TargetEditor(viewport, world) },
	yield: { button: yieldBtn, editor: new YieldEditor(viewport, world) },
};

let oldGraphHash = graph.hash();

setMode('graph');

animate();

function animate() {
	viewport.reset();
	if (graph.hash() !== oldGraphHash) {
		world.generate();
		oldGraphHash = graph.hash();
	}
	const viewPoint = scale(viewport.getOffset(), -1);
	world.draw(ctx, viewPoint);
	ctx.globalAlpha = 0.3;

	for (const tool of Object.values(tools)) {
		tool.editor.display();
	}

	requestAnimationFrame(animate);
}

function dispose() {
	tools.graph.editor.dispose();
	world.markings.length = 0;
}

function save() {
	world.zoom = viewport.zoom;
	world.offset = viewport.offset;

	const element = document.createElement('a');
	element.setAttribute(
		'href',
		'data:application/json;charset=utf-8,' +
			encodeURIComponent(JSON.stringify(world))
	);

	const fileName = 'name.world';
	element.setAttribute('download', fileName);

	element.click();

	localStorage.setItem('world', JSON.stringify(world));
}

function load(e) {
	const file = e.target.files[0];

	if (!file) {
		alert('No file selected');
		return;
	}

	const reader = new FileReader();
	reader.readAsText(file);

	reader.onload = (e) => {
		const fileContent = e.target.result;
		const jsonData = JSON.parse(fileContent);
		world = World.load(jsonData);
		localStorage.setItem('world', JSON.stringify(world));
		location.reload();
	};
}

function setMode(mode) {
	disableEditor();
	tools[mode].button.style.backgroundColor = 'white';
	tools[mode].button.style.filter = 'none';
	tools[mode].editor.enable();
}

function disableEditor() {
	for (const tool of Object.values(tools)) {
		tool.button.style.backgroundColor = 'gray';
		tool.button.style.filter = 'grayscale(100%)';
		tool.editor.disable();
	}
}

function openOsmPanel() {
	osmPanel.style.display = 'block';
}

function closeOsmPanel() {
	osmPanel.style.display = 'none';
}

function parseOsmData() {
	if (osmDataContainer.value === '') {
		alert('Paste Data First!');
		return;
	}
	const res = Osm.parseRoads(JSON.parse(osmDataContainer.value));
	graph.points = res.points;
	graph.segments = res.segments;
	closeOsmPanel();
}
