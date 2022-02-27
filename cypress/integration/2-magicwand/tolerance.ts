import { checkRow, checkTotal, clickCanvas, openImage, setTolerance } from "../../support/functions";

describe('Testing increasing tolerance', () => {
	it('image#1', () => {
		openImage('image-4.png');

		setTolerance(2);
		clickCanvas(211, 425);
		checkRow('selection', 1, '#8D9528', 13);
		checkTotal('selection', 2);

		setTolerance(15);
		checkRow('selection', 2, '#817329', 37);
		checkTotal('selection', 11);
	});
});

describe('Testing reducing tolerance', () => {
	it('image#1', () => {
		openImage('image-4.png');

		setTolerance(2);
		clickCanvas(161, 247);
		checkRow('selection', 1, '#739CE5', 933);
		checkTotal('selection', 3);

		setTolerance(0.2);
		checkRow('selection', 0, '#799DE6', 1194);
		checkTotal('selection', 1);
	});
});

describe('Testing lot of tolerance changes', () => {
	it('image#1', () => {
		openImage('image-4.png');

		setTolerance(2);
		clickCanvas(242, 262);
		checkRow('selection', 0, '#B80B07', 1);
		checkTotal('selection', 1);

		setTolerance(10);
		checkRow('selection', 2, '#C90B05', 125);
		checkTotal('selection', 8);

		setTolerance(15);
		checkRow('selection', 10, '#7D1921', 38);
		checkTotal('selection', 19);

		setTolerance(20);
		checkRow('selection', 3, '#D60C02', 164);
		checkTotal('selection', 31);

		setTolerance(12);
		checkRow('selection', 2, '#C90B05', 125);
		checkTotal('selection', 9);

		setTolerance(9.5);
		checkRow('selection', 0, '#D60C02', 151);
		checkTotal('selection', 7);
	});
});