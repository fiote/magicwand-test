import React, { createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { MenuState, setMenuActive } from './menuSlice';

interface MenuButtonParams {
	code?: string;
	icon: string;
	label: string;
	onClick?: () => void;
}

const MenuButton = (params: MenuButtonParams) => {
	const menu = useSelector<RootState>((state) => state.menu) as MenuState;
	const dispatch = useDispatch();

	const ref = createRef<HTMLButtonElement>();

	const active = menu.active === params.code ? 'active' : '';
	const btnClass = `ui ${active} labeled icon basic button`;

	const onClick = () => {
		if (params.code) dispatch(setMenuActive(params.code));
		if (params.onClick) params.onClick();
		ref.current?.blur();
	};

	return (
		<button ref={ref} className={btnClass} onClick={onClick}>
			<i className={params.icon+' icon'}></i>
			{params.label}
		</button>
	)
}

export default MenuButton;
