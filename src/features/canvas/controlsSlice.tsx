import { createSlice } from '@reduxjs/toolkit';


export interface ColorCounter {
	[key: number]: number;
}


export interface ControlsSliceState {
	[key: string]: ColorCounter
}

export const ControlsSlice = createSlice({
	name: 'controls',

	initialState: {
	} as ControlsSliceState,

	reducers: {
		setColors(state, action) {
			const { key, list } = action.payload;
			state[key] = list;
		},
	},
})

export const { setColors } = ControlsSlice.actions;

export default ControlsSlice.reducer;