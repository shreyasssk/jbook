import { createListenerMiddleware, createAction } from '@reduxjs/toolkit';
import { cellsActions } from '../cellsReducer';

const listenerMiddleware = createListenerMiddleware();

const userAction = createAction('user/custom');

// TODO: work on creating a middleware
// listenerMiddleware.startListening({
// 	actionCreator: cellsActions.fetchCellsComplete,
// });
