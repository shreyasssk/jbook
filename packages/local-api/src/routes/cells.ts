import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
	id: string;
	content: string;
	type: 'text' | 'code';
}

interface LocalApiError {
	code: string;
}

export const createCellsRouter = (filename: string, dir: string) => {
	const router = express.Router();
	router.use(express.json());
	const fullPath = path.join(dir, filename);

	router.get('/cells', async (req: Request, res: Response) => {
		const isLocalApiError = (err: any): err is LocalApiError => {
			return typeof err.code === 'string';
		};

		// read the file
		try {
			const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
			res.send(JSON.parse(result));
		} catch (err) {
			if (isLocalApiError(err)) {
				if (err.code === 'ENOENT') {
					await fs.writeFile(fullPath, '[]', 'utf-8');
					res.send([]);
				}
			} else {
				throw err;
			}
		}
	});

	router.post('/cells', async (req: Request, res: Response) => {
		// serialize list of cells from req obj
		const { cells }: { cells: Cell[] } = req.body;
		console.log(`Received data: ${JSON.stringify(cells)}`);

		// write the cells into the file
		await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
		res.send({ status: 'ok' });
	});

	return router;
};
