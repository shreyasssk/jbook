import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import bundler from '../bundler';
import {
	DeleteCellAction,
	InsertCellAfterAction,
	MoveCellAction,
	UpdateCellAction,
} from './action-types';
import { Cell } from './cell';
import { bundleComplete, bundleStart } from './bundlesReducer';

interface CellsState {
	loading: boolean;
	error: string | null;
	order: string[];
	data: {
		[key: string]: Cell;
	};
}

interface CreateBundleArgs {
	cellId: string;
	input: string;
}

const initialState: CellsState = {
	loading: false,
	error: null,
	order: [],
	data: {},
};

export const createBundle = createAsyncThunk(
	'cells/createBundle',
	async ({ cellId, input }: CreateBundleArgs, { dispatch }) => {
		dispatch(
			bundleStart({
				cellId,
			})
		);

		const result = await bundler(input);

		dispatch(
			bundleComplete({
				cellId,
				bundle: result,
			})
		);
	}
);

const cellsSlice = createSlice({
	name: 'cells',
	initialState,
	reducers: {
		updateCell: (state, action: PayloadAction<UpdateCellAction>) => {
			const { id, content } = action.payload;
			state.data[id].content = content;
		},
		deleteCell: (state, action: PayloadAction<DeleteCellAction>) => {
			delete state.data[action.payload.id];
			state.order = state.order.filter((id) => id !== action.payload.id);
		},
		moveCell: (state, action: PayloadAction<MoveCellAction>) => {
			const { direction } = action.payload;
			const index = state.order.findIndex((id) => id === action.payload.id);
			const targetIndex = direction === 'up' ? index - 1 : index + 1;

			if (targetIndex < 0 || targetIndex > state.order.length - 1) {
				return;
			}

			state.order[index] = state.order[targetIndex];
			state.order[targetIndex] = action.payload.id;
		},
		insertCell: (state, action: PayloadAction<InsertCellAfterAction>) => {
			const cell: Cell = {
				id: randomId(),
				type: action.payload.type,
				content: '',
			};

			state.data[cell.id] = cell;

			const index = state.order.findIndex((id) => id === action.payload.id);

			if (index < 0) {
				state.order.unshift(cell.id);
			} else {
				state.order.splice(index + 1, 0, cell.id);
			}
		},
	},
});

const randomId = () => {
	return Math.random().toString(36).substring(2, 5);
};

export const { updateCell, deleteCell, insertCell, moveCell } =
	cellsSlice.actions;

export default cellsSlice.reducer;
