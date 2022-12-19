import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';
import { fetchPlugin } from './plugins/fetch-plugin';

export default async function bundler(rawCode: string) {
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

	try {
		const result = await esbuild.build({
			entryPoints: ['index.js'],
			bundle: true,
			write: false,
			plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
			define: {
				'process.env.NODE_ENV': '"production"',
				global: 'window',
			},
			jsxFactory: '_React.createElement',
			jsxFragment: '_React.Fragment',
		});

		return {
			code: result.outputFiles[0].text,
			err: '',
		};
	} catch (err) {
		if (err instanceof Error) {
			return {
				code: '',
				err: err.message,
			};
		} else {
			throw err;
		}
	}
}
