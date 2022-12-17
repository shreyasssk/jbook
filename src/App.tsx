import * as esbuild from 'esbuild-wasm';
import { useState, useEffect } from 'react';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';
import { fetchPlugin } from './plugins/fetch-plugin';

export default function App() {
	const [input, setInput] = useState('');
	const [code, setCode] = useState('');

	useEffect(() => {
		try {
			esbuild.build({});
		} catch (error) {
			if (error instanceof Error && error.message.includes('initialize')) {
				esbuild.initialize({
					worker: true,
					wasmURL: 'https://unpkg.com/esbuild-wasm@0.16.7/esbuild.wasm',
				});
			} else {
				throw error;
			}
		}
	}, []);

	const onClick = async () => {
		const result = await esbuild.build({
			entryPoints: ['index.js'],
			bundle: true,
			write: false,
			plugins: [unpkgPathPlugin(), fetchPlugin(input)],
			define: {
				'process.env.NODE_ENV': '"production"',
				global: 'window',
			},
		});

		setCode(result.outputFiles[0].text);
		eval(result.outputFiles[0].text);
	};

	return (
		<div>
			<textarea
				value={input}
				onChange={(e) => setInput(e.target.value)}
			></textarea>
			<div>
				<button onClick={onClick}>Submit</button>
			</div>
			<pre>{code}</pre>
		</div>
	);
}
