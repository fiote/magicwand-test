import React, { createRef, useLayoutEffect } from 'react';
import './Canvas.css';

export const refCanvas = createRef<HTMLCanvasElement>();
const refFeature = createRef<HTMLDivElement>();

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
			<canvas className="empty" ref={refCanvas} onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
		</div>
	)
};

// ===== EVENT FUNCTIONS ============================================

export const listeners = {

}

// ===== LAYOUT FUNCTIONS ===========================================

const applyResizeToCanvas = () => {
	const div = refFeature.current;
	const canvas = refCanvas.current;
	if (!canvas || !div) return;

	const cs = getComputedStyle(div);
	let cWidth = parseInt(cs.getPropertyValue('width'),10);
	let cHeight = parseInt(cs.getPropertyValue('height'),10);

	canvas.style.width = (cWidth - 10)+'px';
	canvas.style.height = (cHeight - 10)+'px';
};

export const setImageToCanvas = (image: HTMLImageElement) => {
	const div = refFeature.current;
	const canvas = refCanvas.current;
	if (!canvas || !div) return;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const cs = getComputedStyle(div);
	let cWidth = parseInt(cs.getPropertyValue('width'),10);
	let cHeight = parseInt(cs.getPropertyValue('height'),10);

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

	let sx = (cWidth - iWidth)/2;
	let sy = (cHeight - iHeight)/2;

    ctx.drawImage(image, sx, sy, iWidth, iHeight);

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
		img.onload = () => resolve(img);
		img.src = base64;
	});
};


export default Canvas;