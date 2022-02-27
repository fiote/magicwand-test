import { checkRow, openImage } from "../../support/functions";

describe('Check of specific colors are found on a specific order', () => {
	it('image#1', () => {
		openImage('image-1.png');
		checkRow('pixels', 2, '#434343', 599);
		checkRow('pixels', 15, '#FE5050', 144);
	});
	it('image#2', () => {
		openImage('image-2.png');
		checkRow('pixels', 0, '#262626', 7026);
		checkRow('pixels', 10, '#ED42F0', 240);
	});
	it('image#3', () => {
		openImage('image-3.png');
		checkRow('pixels', 6, '#F1F1F1', 353);
		checkRow('pixels', 15, '#F9D848', 154);
	});
});