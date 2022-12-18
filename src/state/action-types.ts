import { CellTypes } from './cell';

export enum ActionType {
	MOVE_CELL = 'move_cell',
	DELETE_CELL = 'delete_cell',
	INSERT_CELL_BEFORE = 'insert_cell_before',
	INSERT_CELL_AFTER = 'insert_cell_after',
	UPDATE_CELL = 'update_cell',
}

export type Direction = 'up' | 'down';
export interface MoveCellAction {
	id: string;
	direction: Direction;
}

export interface DeleteCellAction {
	id: string;
}

export interface InsertCellBeforeAction {
	id: string | null;
	type: CellTypes;
}

export interface InsertCellAfterAction {
	id: string | null;
	type: CellTypes;
}

export interface UpdateCellAction {
	id: string;
	content: string;
}

export type Action =
	| MoveCellAction
	| DeleteCellAction
	| InsertCellBeforeAction
	| InsertCellAfterAction
	| UpdateCellAction;
