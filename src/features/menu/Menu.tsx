import React from 'react';
import './Menu.css';

interface MenuParams {
	children?: React.ReactNode
}

const Menu = (params: MenuParams) => {
	return (
		<div id='feature-menu'>
			{params.children}
		</div>
	)
}

export default Menu;