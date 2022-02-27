const openImage = (name: string, visit: boolean = false) => {
	cy.visit('http://localhost:3000/');

	cy.fixture(name).then(fileContent => {
		cy.get('[data-testid="filepicker-file"]').attachFile({
			fileContent: fileContent,
			fileName: name,
			encoding: "base64"
		});
	});
}

const checkResult = (hex1: string, hex2: string, count3: number, count4: number, total: number) => {
		cy.get('.color-row:eq(0) .color-label', { timeout: 1000 }).should('contain', hex1);
		cy.get('.color-row:eq(1) .color-label', { timeout: 1000 }).should('contain', hex2);
		cy.get('.color-row:eq(2) .color-count', { timeout: 1000 }).should('contain', count3);
		cy.get('.color-row:eq(3) .color-count', { timeout: 1000 }).should('contain', count4);
		cy.get('.color-row').its('length').should('eq', total);
}

describe('Testing image upload and color parsing', () => {
	it('image#1', () => { openImage('image-1.png', true); checkResult('#E60000', '#FF0000', 123, 105, 92); });
	it('image#2', () => { openImage('image-2.png'); checkResult('#E912ED', '#ED12F0', 63, 46, 87); });
	it('image#3', () => { openImage('image-3.png'); checkResult('#F8CE19', '#FFD61A', 109, 105, 154); });
});