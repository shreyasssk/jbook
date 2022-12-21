import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BundleStartAction, BundleCompleteAction } from './action-types';

interface BundlesState {
	[key: string]:
		| {
				loading: boolean;
				code: string;
				err: string;
		  }
		| undefined;
}

const initialState: BundlesState = {};

const bundleSlice = createSlice({
	name: 'bundle',
	initialState,
	reducers: {
		bundleStart: (state, action: PayloadAction<BundleStartAction>) => {
			state[action.payload.cellId] = {
				loading: true,
				code: '',
				err: '',
			};
		},
		bundleComplete: (state, action: PayloadAction<BundleCompleteAction>) => {
			state[action.payload.cellId] = {
				loading: false,
				code: action.payload.bundle.code,
				err: action.payload.bundle.err,
			};
		},
	},
});

export const { bundleStart, bundleComplete } = bundleSlice.actions;

export default bundleSlice.reducer;
