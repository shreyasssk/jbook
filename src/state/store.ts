import { configureStore } from '@reduxjs/toolkit';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';

export const store = configureStore({
	reducer: {
		cells: cellsReducer,
		bundles: bundlesReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
