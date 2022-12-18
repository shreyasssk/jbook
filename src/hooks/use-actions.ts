import { useDispatch } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as actionCreators from '../state/cellsReducer';

export const useActions = () => {
	const dispatch = useDispatch();

	return bindActionCreators(actionCreators, dispatch);
};
