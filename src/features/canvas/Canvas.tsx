import React, { createRef, useLayoutEffect } from 'react';
import './Canvas.css';
import { ColorCounter } from './controlsSlice';

export const refCanvas = createRef<HTMLCanvasElement>();
const refFeature = createRef<HTMLDivElement>();

const Canvas = () => {

	useLayoutEffect(() => {
		window.addEventListener('resize',applyResizeToCanvas);
		applyResizeToCanvas();
	},[]);

	const onMouseDown = (event: React.MouseEvent) => {
		const { offsetX: x, offsetY: y } = event.nativeEvent;
		listeners.onMouseDown?.call(null, x, y);
	};

	const onMouseUp = (event: React.MouseEvent) => {
		const { offsetX: x, offsetY: y } = event.nativeEvent;
		listeners.onMouseUp?.call(null, x, y);
	};

	return (
		<div id="feature-canvas" ref={refFeature}>
			<canvas data-testid="main-canvas" className="empty" ref={refCanvas} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
		</div>
	)
};

export default Canvas;

// ===== LISTENERS ==================================================

type IMousePoint = (x: number, y: number) => void;

const listeners = {
} as {
	[key: string]: IMousePoint;
}

export const setCanvasListener = (key: string, fn: IMousePoint) => {
	listeners[key] = fn;
};

export const removeCanvasListeners = () => {
	const keys = Object.keys(listeners);
	keys.forEach(key => delete listeners[key]);
};

// ===== FEATURE VARIABLES ==========================================

export interface Point {
	id: number;
	block: number;
	x: number;
	y: number;
	rgb: v3;
	color: number;
}

export type v3 = [number, number, number];

export const canvasGrid = [] as Point[];

const bounds = {
	min: {x: 0, y: 0},
	max: {x:Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY},
	size: {width: 0, height: 0}
};

// ===== CANVAS FUNCTIONS ===========================================

const applyResizeToCanvas = () => {
	const div = document.querySelector<HTMLDivElement>('#feature-canvas');
	const canvas = div?.querySelector<HTMLCanvasElement>('canvas');
	if (!canvas || !div) return { cWidth: 0, cHeight: 0 };

	canvas.style.display = 'none';

	const cs = getComputedStyle(div);
	let cWidth = parseInt(cs.getPropertyValue('width'),10);
	let cHeight = parseInt(cs.getPropertyValue('height'),10);

	canvas.style.width = (cWidth)+'px';
	canvas.style.height = (cHeight)+'px';
	canvas.style.display = 'block';

	return { cWidth, cHeight };
};

export const setImageToCanvas = (image: HTMLImageElement) : {colors?: ColorCounter} => {
	const div = refFeature.current;
	const canvas = refCanvas.current;
	if (!canvas || !div) return { };

	const ctx = canvas.getContext("2d");
	if (!ctx) return { };

	const { cWidth, cHeight } = applyResizeToCanvas();

	let iWidth = image.width;
	let iHeight = image.height;

	const prWidth = cWidth/iWidth;
	const prHeight = cHeight/iHeight;

	const prMin = Math.min(prWidth, prHeight);
	if (prMin < 1) {
		iWidth *= prMin;
		iHeight *= prMin;
	}

	bounds.size.width = canvas.width = cWidth;
	bounds.size.height = canvas.height = cHeight;

	let sx = Math.floor((cWidth - iWidth)/2);
	let sy = Math.floor((cHeight - iHeight)/2);

	bounds.min.x = sx;
	bounds.min.y = sy;

	bounds.max.x = sx + iWidth;
	bounds.max.y = sy + iHeight;

    ctx.drawImage(image, sx, sy, iWidth, iHeight);

	readCanvasGrid();

	const colors = getCanvasColors();

	return { colors };
};

export const readCanvasGrid = () => {
	canvasGrid.length = 0;

	const canvas = refCanvas.current;
	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const { min, max } = bounds;

	for (let x = min.x; x < max.x; x++) {
		for (let y = min.y; y < max.y; y++) {
			const id = getPointId(x, y);
			const [r,g,b] = ctx.getImageData(x, y, 1, 1).data;
			const rgb = [r,g,b] as v3;
			const color = getIntFromRGB(rgb);
			canvasGrid[id] = {id, block: 0, x, y, rgb, color};
		}
	}
};

export const getCanvasPoint = (x: number, y: number) => {
	const id = getPointId(x, y);
	return canvasGrid[id];
}

const getCanvasColors = () => {
	const colors = {} as {[key: number]: number};
	canvasGrid.forEach(p => {
		if (!colors[p.color]) colors[p.color] = 0;
		colors[p.color]++;
	});
	return colors;
};

export const getPointId = (x: number, y: number) => {
	if (x < 0 || y < 0 || x >= bounds.size.width || y >= bounds.size.height) return -1;
	return x*bounds.size.height + y;
}

// ===== BRUSH FUNCTIONS ============================================

let brush : ImageData;
let brushData : Uint8ClampedArray;

export const paintPixel = (x: number, y: number, rgb: v3) => {
	const canvas = refCanvas.current;
	const ctx = canvas?.getContext("2d");
	if (!ctx) return;

	if (!brush) {
		brush = ctx.createImageData(1,1);
		brushData = brush.data;
	}

	const [r,g,b] = rgb;
	brushData[0] = r;
	brushData[1] = g;
	brushData[2] = b;
	brushData[3] = 255;
	ctx.putImageData(brush, x, y);
}

// ===== IMAGE FUNCTIONS ============================================

export const getFileAsBase64 = (file: File): Promise<string | undefined> => {
	return new Promise(resolve => {
		var fr = new FileReader();
		fr.onload = () => resolve(fr.result?.toString());
		fr.readAsDataURL(file);
	});
};

export const createImageFromBase64 = (base64: string): Promise<HTMLImageElement> => {
	return new Promise(resolve => {
		const img = new Image();
		img.onload = (e) => resolve(img);
		img.src = base64;
	});
};

// ===== COLOR FUNCTIONS ============================================

export const getIntFromRGB = (rgb: v3) => {
	const [r,g,b] = rgb;
	return 65536 * r + 256 * g + b;
}

export const getRGBfromInt = (color: number) : v3 => {
	const r = Math.floor(color/65536);
	color -= r*65536;

	const g = Math.floor(color/256);
	color -= g*256;

	const b = color;

	return [r,g,b];
}

const componentToHex = (c: number) => {
  	var hex = c.toString(16);
  	return hex.length === 1 ? "0" + hex : hex;
}

export const getHexFromRGB = (rgb: v3) => {
	const [r,g,b] = rgb;
  	const hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	return hex.toUpperCase();
}