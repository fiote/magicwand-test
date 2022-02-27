export const openImage = (name: string, visit: boolean = true) => {
	if (visit) cy.visit('http://localhost:3000/');

	cy.fixture(name).then(fileContent => {
		cy.get('[data-testid="filepicker-file"]').attachFile({
			fileContent: fileContent,
			fileName: name,
			encoding: "base64"
		});
	});
}

export const checkPixels = (hex1: string, hex2: string, count3: number, count4: number, total: number) => {
	checkColorStats('pixels', hex1, hex2, count3, count4, total);
}

export const checkSelection = (hex1: string, hex2: string, count3: number, count4: number, total: number) => {
	checkColorStats('selection', hex1, hex2, count3, count4, total);
}

const checkColorStats = (code: string, hex1: string, hex2: string, count3: number, count4: number, total: number) => {
	const block = cy.get('.stat-block.'+code);
	block.get('.color-row:eq(0) .color-label', { timeout: 5000 }).should('contain', hex1);
	block.get('.color-row:eq(1) .color-label', { timeout: 5000 }).should('contain', hex2);
	block.get('.color-row:eq(2) .color-count', { timeout: 5000 }).should('contain', count3);
	block.get('.color-row:eq(3) .color-count', { timeout: 5000 }).should('contain', count4);
	block.get('.color-row').its('length').should('eq', total);
}