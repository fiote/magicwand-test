import React from 'react';
import { refCanvas } from '../canvas/Canvas';
import MenuButton from '../menu/MenuButton';

const MagicWand = () => {

	const onClick = () => {
		const canvas = refCanvas.current;
		if (!canvas) return;
	};

	return (
		<div id='feature-magicwand'>
			<MenuButton code='magicwand' icon='magic' label='Magic Wand' onClick={onClick} />
		</div>
	)
}

export default MagicWand;