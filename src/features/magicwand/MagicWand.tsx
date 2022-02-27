import React, { createRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { canvasGrid, getCanvasPoint, getPointId, paintPixel, Point, readCanvasGrid, setCanvasListener, v3 } from '../canvas/Canvas';
import { ColorCounter, setColors } from '../canvas/controlsSlice';
import MenuButton from '../menu/MenuButton';
import MenuConfig from '../menu/MenuConfig';
import './MagicWand.css';

const MagicWand = () => {
	const dispatch = useDispatch();

	setCanvasListener('magicwand', 'onMouseUp', (x, y) => {
		const { colors } = execMagicWandAt(x,y);
		forwardColors(colors);
	});

	const [valueTolerance, setTolerance] = useState(2);

	const ref = createRef<HTMLInputElement>();

	const onMouseUpTolerance = (event: React.MouseEvent<HTMLInputElement>) => {
		if (!ref.current) return;
		const tol = parseFloat(ref.current.value);
		setTolerance(tol);
		const { colors } = applyMagicTolerance(tol);
		if (colors) forwardColors(colors);
	};

	const forwardColors = (colors: ColorCounter) => {
		dispatch(setColors({key: 'Selection', list: colors}));
	};

	return (
		<div id='feature-magicwand'>
			<MenuButton code='magicwand' icon='magic' label='Magic Wand' />
			<MenuConfig code='magicwand'>
				<div id='tolerance-block' className='config-block'>
					<label>Tolerance:</label>
					<div className='slider'>
						<input ref={ref} id="tolerance" type="range" min="0" max="50" onMouseUp={onMouseUpTolerance} defaultValue={valueTolerance} step="0.1" /> <div className='tolerance'> {valueTolerance.toFixed(1)}</div>
					</div>
				</div>
			</MenuConfig>
		</div>
	)
}

export default MagicWand;


// ===== MAGIC WAND =================================================

let paintedBorder = [] as number[];
let selectedArea = [] as number[];
let lastClicked = null as {x: number, y:number} | null;
let magicTolerance = 2;

const execMagicWandAt = (x: number, y: number, force: boolean = false) => {
	lastClicked = {x, y};
	const colors = {} as ColorCounter;

	// 'unpaiting' any border already painted
	paintedBorder.forEach(id => paintPoint(id));
	// resetting the border data
	paintedBorder = [];
	// if the grid is not mapped, read it
	if (!canvasGrid?.length) readCanvasGrid();
	// get the clicked point based on its xy
	const point = getCanvasPoint(x,y);
	// if it does not exist, stop here
	if (!point) return { colors };

	// if we're clicking inside of the selected area, stop here
	if (selectedArea.includes(point.id) && !force) {
		selectedArea = [];
		return { colors };
	}
	// getting the area around the point
	const {area, border} = getAreaAroundPoint(point);
	// painting its border
	border.forEach(id => paintBorder(id));
	// storing the data
	paintedBorder = border;
	selectedArea = area;

	area.forEach(id => {
		const p = canvasGrid[id];
		const color = p.color;
		if (!colors[color]) colors[color] = 0;
		colors[color]++;
	});

	return { colors };
}

const applyMagicTolerance = (value: number) => {
	magicTolerance = value;
	if (!lastClicked) return { };
	const { colors } = execMagicWandAt(lastClicked.x, lastClicked.y, true);
	return { colors };
}

export const resetMagicWand = () => {
	lastClicked = null;
	paintedBorder = [];
	selectedArea = [];
};

const adders = [[0,-1], [0,+1], [-1,0], [+1,0]];
let nextBlockId = 0;

// flags the whole canvasGrid based on the clicked pixel and the selected tolerance, the get the affected area and its border
const getAreaAroundPoint = (clicked: Point, extra: boolean = false) => {

	// create a map to mark every pixel with the answer "does this color is within tolerance-distance of thec clicked point?""
	const map = [] as number[][];

	// for every pixel
	for(const p1 of canvasGrid) {
		if (!p1) continue;
		// we get its position
		const { x, y } = p1;
		// and the delta color between the clicked pixel and it
		const delta = getColorDelta(clicked, p1);
		// if there is no map for its line yet, create one
		if (!map[y]) map[y] = [];
		// then map its pixel flag
		map[y][x] = delta <= magicTolerance ? 1 : 0;
	}
	// increasing the blocker count	and setting it for the clicked pixel
	clicked.block = ++nextBlockId;
	// creating a control stack so we can keep expanding and processing pixels
	const stack = [clicked.id];
	// while also storing all the pixels inside its area
	const area = [clicked.id];
	// and the 'border' pixels so we can atually show the selection
	const border = [] as number[];
	// while there are pixels to process
	while (stack.length) {
		// get the first on the list
		const id1 = stack.shift();
		if (!id1) continue;
		// get the canvasGrid entry for it
		const p1 = canvasGrid[id1];
		// get its coords
		const {x,y} = p1;
		// run the adders to iterate around the pixel
		for(const add of adders) {
			// get the neighbor coords
			const x2 = x+add[0];
			const y2 = y+add[1];
			// get its id
			const id2 = getPointId(x2,y2);
			const p2 = canvasGrid[id2];
			// if there is no such id (this means it's outside of the canvas), we skip the add
			if (!p2) continue;
			// otherwise, we get the flag for it
			const flag = map[y2][x2];
			if (flag > 0)  {
				// if it's marked as tolerated, let's unset it so it won't be processed again
				map[y2][x2] = -1;
				// then we add it to the stack, so we can process around it as well
				stack.push(id2);
				area.push(id2);
				// marking the neighbor with the same block value
				canvasGrid[id2].block = clicked.block;
			}
			if (flag === 0) {
				border.push(id2);
				map[y2][x2] = -1;
			}
		}
	}

	return { area, border };
}

// ===== BORDER CONTROL =============================================

// paints a red pixel based on a pixel xy position
const paintBorder = (id: number) => {
	const p = canvasGrid[id];
	if (p) paintPixel(p.x, p.y, [255,0,0]);
}

// paints the actual pixel back to its xy position
const paintPoint = (id: number) => {
	const p = canvasGrid[id];
	if (p) paintPixel(p.x, p.y, p.rgb);
}

// ===== COLOR DELTA ================================================

// chache object so we can store delta values between colors, so we don't need to calculate it again
let colorCache = {} as {[key: string]: number};

// returns the delta difference between two points on the canvas
const getColorDelta = (p1: Point, p2: Point) => {
	// if their color is the same, the delta is of course zero
	if (p1.color === p2.color) return 0;
	// creating a mash string so we can check its cache
	const mash = p1.color+'.'+p2.color;
	const cached = colorCache[mash];
	// if there is a cache, return it
	if (cached !== undefined) return cached;
	// if there is not, actually calculate the differnce
	const delta = deltaE(p1.rgb, p2.rgb);
	// cache it
	colorCache[mash] = delta;
	// then return!
	return delta;
}

// rgb color comparation function (from: https://github.com/antimatter15/rgb-lab)

function deltaE(rgbA: v3, rgbB: v3) {
	let labA = rgb2lab(rgbA);
	let labB = rgb2lab(rgbB);
	let deltaL = labA[0] - labB[0];
	let deltaA = labA[1] - labB[1];
	let deltaB = labA[2] - labB[2];
	let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
	let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
	let deltaC = c1 - c2;
	let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
	deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
	let sc = 1.0 + 0.045 * c1;
	let sh = 1.0 + 0.015 * c1;
	let deltaLKlsl = deltaL / (1.0);
	let deltaCkcsc = deltaC / (sc);
	let deltaHkhsh = deltaH / (sh);
	let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
	return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb: v3) {
	let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
	r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
	x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
	y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
	z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
	x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
	y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
	z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
	return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}
