import { createSlice } from '@reduxjs/toolkit';

export interface ControlsSliceState {
	onMouseDown?: (ev: MouseEvent) => void;
	onMouseUp?: (ev: MouseEvent) => void;
	onClick?: (ev: MouseEvent) => void;
}

export const ControlsSlice = createSlice({
	name: 'controls',

	initialState: {
	} as ControlsSliceState,

	reducers: {
		setOnCanvasClick(state, action) {
			state.onClick = action.payload;
		},
		setOnCanvasMouseDown(state, action) {
			state.onMouseDown = action.payload;
		},
		setOnCanvasMouseUp(state, action) {
			state.onMouseUp = action.payload;
		}
	},
})

export const { setOnCanvasClick, setOnCanvasMouseDown, setOnCanvasMouseUp } = ControlsSlice.actions;

export default ControlsSlice.reducer;