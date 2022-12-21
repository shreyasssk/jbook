import {
	createAsyncThunk,
	createSlice,
	PayloadAction,
	nanoid,
} from '@reduxjs/toolkit';
import bundler from '../bundler';
import {
	DeleteCellAction,
	FetchCellsAction,
	FetchCellsCompleteAction,
	FetchCellsErrorAction,
	InsertCellAfterAction,
	MoveCellAction,
	UpdateCellAction,
	SaveCellsErrorAction,
} from './action-types';
import { Cell } from './cell';
import { bundleComplete, bundleStart } from './bundlesReducer';
import { RootState } from './store';
import axios from 'axios';

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

// const randomId = () => {
// 	return Math.random().toString(36).substring(2, 5);
// };

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

export const fetchCells = createAsyncThunk(
	'cells/fetchCells',
	async (_, { dispatch }) => {
		// emit fetchCells event
		dispatch(cellsSlice.actions.fetchNewCells({ _ }));

		try {
			const { data }: { data: Cell[] } = await axios.get('/cells');

			// emit fetchCellsComplete event
			dispatch(
				cellsSlice.actions.fetchCellsComplete({
					data,
				})
			);
		} catch (err) {
			// emit fetchCellsError event
			if (err instanceof Error) {
				dispatch(
					cellsSlice.actions.fetchCellsError({
						data: err.message,
					})
				);
			}
		}
	}
);

export const saveCells = createAsyncThunk<void, void, { state: RootState }>(
	'cells/saveCells',
	async (_, { dispatch, getState }) => {
		const {
			cells: { data, order },
		} = getState();

		const cells = order.map((id) => data[id]);

		try {
			await axios.post('/cells', { cells });
		} catch (err) {
			if (err instanceof Error) {
				dispatch(
					cellsSlice.actions.saveCellsError({
						data: err.message,
					})
				);
			}
		}
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
				id: nanoid(),
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
		fetchNewCells: (state, action: PayloadAction<FetchCellsAction>) => {
			state.loading = true;
			state.error = null;
		},
		fetchCellsComplete: (
			state,
			action: PayloadAction<FetchCellsCompleteAction>
		) => {
			state.order = action.payload.data.map((cell) => cell.id);
			state.data = action.payload.data.reduce((acc, cell) => {
				acc[cell.id] = cell;
				return acc;
			}, {} as CellsState['data']);
		},
		fetchCellsError: (state, action: PayloadAction<FetchCellsErrorAction>) => {
			state.loading = false;
			state.error = action.payload.data;
		},
		saveCellsError: (state, action: PayloadAction<SaveCellsErrorAction>) => {
			state.error = action.payload.data;
		},
	},
});

export const {
	updateCell,
	deleteCell,
	insertCell,
	moveCell,
	fetchCellsComplete,
	fetchCellsError,
	fetchNewCells,
	saveCellsError,
} = cellsSlice.actions;

export const cellsActions = cellsSlice.actions;

export default cellsSlice.reducer;
