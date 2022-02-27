import React, { createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { MenuState, setMenuActive } from './menuSlice';

interface MenuConfigParams {
	code?: string;
	children?: React.ReactNode
}

const MenuConfig = (params: MenuConfigParams) => {
	const menu = useSelector<RootState>((state) => state.menu) as MenuState;

	const active = menu.active === params.code ? 'config-visible' : '';
	const btnClass = `menu-config ${active}`;

	return (
		<div className={btnClass}>
			{params.children}
		</div>
	)
}

export default MenuConfig;
