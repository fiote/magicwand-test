import { createSlice } from '@reduxjs/toolkit';

export interface MenuState {
	active: string;
}

export const menuSlice = createSlice({
	name: 'menu',

	initialState: {
		active: ''
	} as MenuState,

	reducers: {
		setMenuActive(state, action) {
			state.active = action.payload;
		}
	},
})

export const { setMenuActive } = menuSlice.actions;

export default menuSlice.reducer;