import React, { createRef, useLayoutEffect } from 'react';
import './Canvas.css';
import { ColorCounter } from './controlsSlice';

export const refCanvas = createRef<HTMLCanvasElement>();
const refFeature = createRef<HTMLDivElement>();

interface Point {
	id: number;
	block: number;
	x: number;
	y: number;
	rgb: v3;
	color: number;
}

type v3 = [number, number, number];

const grid = [] as Point[];

const bounds = {
	min: {x: 0, y: 0},
	max: {x:Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY}
};

const Canvas = () => {

	useLayoutEffect(() => {
		window.addEventListener('resize',applyResizeToCanvas);
		applyResizeToCanvas();
	},[]);

	const onClick = () => {

	};

	const onMouseDown = () => {

	};

	const onMouseUp = () => {

	};

	return (
		<div id="feature-canvas" ref={refFeature}>
			<canvas data-testid="main-canvas" className="empty" ref={refCanvas} onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
		</div>
	)
};

// ===== EVENT FUNCTIONS ============================================

export const listeners = {

}

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

	canvas.width = cWidth;
	canvas.height = cHeight;

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

const readCanvasGrid = () => {
	grid.length = 0;

	const canvas = refCanvas.current;
	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	let id = 0;
	const { min, max } = bounds;

	for (let x = min.x; x < max.x; x++) {
		for (let y = min.y; y < max.y; y++) {
			const [r,g,b] = ctx.getImageData(x, y, 1, 1).data;
			const rgb = [r,g,b] as v3;
			const color = getIntFromRGB(rgb);
			grid.push({id, block: 0, x, y, rgb, color});
			id++;
		}
	}
};

const getCanvasColors = () => {
	const colors = {} as {[key: number]: number};
	grid.forEach(p => {
		if (!colors[p.color]) colors[p.color] = 0;
		colors[p.color]++;
	});
	return colors;
};

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

export default Canvas;