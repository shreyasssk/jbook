import { useState, useEffect } from 'react';
import { useActions } from '../hooks/use-actions';

import CodeEditor from './code-editor';
import Preview from './preview';
import bundler from '../bundler';
import Resizable from './resizable';
import { Cell } from '../state/cell';

interface CodeCellProps {
	cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
	const [code, setCode] = useState('');
	const [err, setErr] = useState('');
	const { updateCell } = useActions();
	const { content } = cell;

	useEffect(() => {
		const timer = setTimeout(async () => {
			const output = await bundler(content);
			setCode(output.code);
			setErr(output.err);
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [content]);

	return (
		<Resizable direction="vertical">
			<div
				style={{
					height: 'calc(100% - 10px)',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Resizable direction="horizontal">
					<CodeEditor
						initialValue={content}
						onChange={(value) => updateCell({ id: cell.id, content: value })}
					/>
				</Resizable>
				<Preview code={code} err={err} />
			</div>
		</Resizable>
	);
};

export default CodeCell;
