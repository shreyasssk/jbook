import { useState } from 'react';

import CodeEditor from './code-editor';
import Preview from './preview';
import bundler from '../bundler';
import Resizable from './resizable';

export default function CodeCell() {
	const [code, setCode] = useState('');
	const [input, setInput] = useState('');

	const onClick = async () => {
		const output = await bundler(input);

		setCode(output);
	};

	return (
		<Resizable direction="vertical">
			<div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
				<CodeEditor initialValue="const a = 1;" onChange={setInput} />
				<Preview code={code} />
			</div>
		</Resizable>
	);
}