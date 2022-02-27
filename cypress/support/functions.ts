
const cyGetOptions = { timeout: 5000 };

export const openImage = (name: string, visit: boolean = true) => {
	if (visit) cy.visit('http://localhost:3000/');

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

export const checkPixels = (hex0: string, hex1: string, count2: number, count3: number, total: number) => {
	checkLabel('pixels', 0, hex0);
	checkLabel('pixels', 1, hex1);
	checkCount('pixels', 2, count2);
	checkCount('pixels', 3, count3);
	checkTotal('pixels', total);
}

export const checkSelection = (index: number, hex: string, count: number) => {
	cy.get(`.stat-block.selection .color-row:eq(${index}) .color-label`, cyGetOptions).should('contain', hex);
	cy.get(`.stat-block.selection .color-row:eq(${index}) .color-count`, cyGetOptions).should('contain', count);
}

export const checkLabel = (block: string, index: number, hex: string) => {
	cy.get(`.stat-block.${block} .color-row:eq(${index}) .color-label`, cyGetOptions).should('contain', hex);
}

export const checkCount = (block: string, index: number, count: number) => {
	cy.get(`.stat-block.${block} .color-row:eq(${index}) .color-count`, cyGetOptions).should('contain', count);
}

export const checkTotal = (block: string, total: number) => {
	const cyget = cy.get(`.stat-block.${block} .color-row`, cyGetOptions);
	(total) ? cyget.its('length').should('eq', total) : cyget.should('not.exist');
}