import { createSlice } from '@reduxjs/toolkit';


export interface ColorCounter {
	[key: number]: number;
}

export interface ColorCount {
	color: number;
	count: number;
}


export interface ControlsSliceState {
	[key: string]: {
		top50: ColorCount[];
		total: number;
	}
}

export const ControlsSlice = createSlice({
	name: 'controls',

	initialState: {
	} as ControlsSliceState,

	reducers: {
		setColors(state, action) {
			const { key, list } = action.payload;

			const arraylist = Object.keys(list).map<ColorCount>(color => ({color: parseInt(color), count: list[color]}));
			arraylist.sort((a,b) => b.count - a.count);
			const top50 = arraylist.slice(0,50);

			state[key] = {top50, total: arraylist.length};
		},
	},
})

export const { setColors } = ControlsSlice.actions;

export default ControlsSlice.reducer;