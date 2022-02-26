import { createSlice } from '@reduxjs/toolkit';


export interface ColorCounter {
	[key: number]: number;
}


export interface ControlsSliceState {
	colors: ColorCounter
}

export const ControlsSlice = createSlice({
	name: 'controls',

	initialState: {
	} as ControlsSliceState,

	reducers: {
		setColors(state, action) {
			state.colors = action.payload;
		},
	},
})

export const { setColors } = ControlsSlice.actions;

export default ControlsSlice.reducer;