
const cyGetOptions = { timeout: 5000 };

export const openImage = (name: string) => {
	cy.viewport(1000, 660);

	cy.visit('http://localhost:3000/');

	cy.fixture(name).then(fileContent => {
		cy.get('[data-testid="filepicker-file"]').attachFile({
			fileContent: fileContent,
			fileName: name,
			encoding: "base64"
		});
		cy.get(`.stat-block.pixels .color-row`, cyGetOptions).should('exist');
	});
}

export const clickCanvas = (x: number, y: number) => {
	cy.get('[data-testid="main-canvas"]', cyGetOptions).click(x, y, {force: true});
}

export const setTolerance = (value: number) => {
	cy.get('#tolerance').invoke('val', value).trigger('mouseup');
}

export const checkRow = (block: string, index: number, hex: string, count: number) => {
	cy.get(`.stat-block.${block} .color-row:eq(${index}) .color-label`, cyGetOptions).should('contain', hex);
	cy.get(`.stat-block.${block} .color-row:eq(${index}) .color-count`, cyGetOptions).should('contain', count);
}

export const checkLabel = (block: string, index: number, hex: string) => {
	cy.get(`.stat-block.${block} .color-row:eq(${index}) .color-label`, cyGetOptions).should('contain', hex);
}

export const checkCount = (block: string, index: number, count: number) => {
	cy.get(`.stat-block.${block} .color-row:eq(${index}) .color-count`, cyGetOptions).should('contain', count);
}

export const checkTotal = (block: string, total: number) => {
	cy.get(`.stat-block.${block} .block-count`, cyGetOptions).should('contain', total);
}