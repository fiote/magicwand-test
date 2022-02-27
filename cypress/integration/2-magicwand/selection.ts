import { checkSelection, checkTotal, clickCanvas, openImage } from "../../support/functions";

describe('Testing simple selection', () => {
	it('image#1', () => {
		openImage('image-4.png');

		clickCanvas(161, 247);
		checkSelection(0, '#799DE6', 1194);
		checkSelection(1, '#739CE5', 933);
		checkTotal('selection', 2);
	});
});

describe('Testing clearing a seletion', () => {
	it('image#1', () => {
		openImage('image-4.png');

		clickCanvas(161, 247);
		checkTotal('selection', 2);

		clickCanvas(161, 247);
		checkTotal('selection', 0);
	});
});

describe('Testing switching selections', () => {
	it('image#1', () => {
		openImage('image-4.png');

		clickCanvas(161, 247);
		checkTotal('selection', 2);

		clickCanvas(341, 370);
		checkSelection(0, '#19100F', 399);
		checkTotal('selection', 1);

	});
});