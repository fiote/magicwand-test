import { checkPixels, openImage } from "../../support/functions";

describe('Testing image upload and color parsing', () => {
	it('image#1', () => { openImage('image-1.png'); checkPixels('#E60000', '#FF0000', 123, 105, 92); });
	it('image#2', () => { openImage('image-2.png'); checkPixels('#E912ED', '#ED12F0', 63, 46, 87); });
	it('image#3', () => { openImage('image-3.png'); checkPixels('#F8CE19', '#FFD61A', 109, 105, 154); });
});