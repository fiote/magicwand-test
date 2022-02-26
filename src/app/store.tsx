import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../features/menu/menuSlice';
import controlReducer from '../features/canvas/controlsSlice';

const store = configureStore({
	reducer: {
		menu: menuReducer,
		controls: controlReducer
	},
})

export type RootState = ReturnType<typeof store.getState>;

export default store;