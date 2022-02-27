import { checkTotal, openImage } from "../../support/functions";

describe('Check total of found colors', () => {
	it('image#1', () => {
		openImage('image-1.png');
		checkTotal('pixels', 249);
	});
	it('image#2', () => {
		openImage('image-2.png');
		checkTotal('pixels', 148);
	});
	it('image#3', () => {
		openImage('image-3.png');
		checkTotal('pixels', 237);
	});
});