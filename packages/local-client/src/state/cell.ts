// import {
// 	CreateSliceOptions,
// 	ValidateSliceCaseReducers,
// } from '@reduxjs/toolkit';

export type CellTypes = 'code' | 'text';

export interface Cell {
	id: string;
	type: CellTypes;
	content: string;
}

// export const cellsReducerOptions: ValidateSliceCaseReducers = {
//   updateCell: (state, action: PayloadAction<UpdateCellAction>) => {
//     const { id, content } = action.payload;
//     state.data[id].content = content;
//   },
// }
