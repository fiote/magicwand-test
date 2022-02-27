import { checkRow, openImage } from "../../support/functions";

describe('Check of specific colors are found on a specific order', () => {
	it('image#1', () => {
		openImage('image-1.png');
		checkRow('pixels', 3, '#434343', 599);
		checkRow('pixels', 16, '#FE5050', 144);
	});
	it('image#2', () => {
		openImage('image-2.png');
		checkRow('pixels', 1, '#262626', 7026);
		checkRow('pixels', 11, '#ED42F0', 240);
	});
	it('image#3', () => {
		openImage('image-3.png');
		checkRow('pixels', 7, '#F1F1F1', 353);
		checkRow('pixels', 16, '#F9D848', 154);
	});
});