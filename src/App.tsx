import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import CodeCell from './components/code-cell';
// import TextEditor from './components/text-editor';
import CellList from './components/cell-list';
import { insertCell } from './state/cellsReducer';

export default function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(
			insertCell({
				id: null,
				type: 'code',
			})
		);
		dispatch(
			insertCell({
				id: null,
				type: 'text',
			})
		);
	}, [dispatch]);

	return (
		<div>
			<CellList />
		</div>
	);
}
