import express, { Router } from 'express';
import TodosController from '../controllers/DriversController';

const router = Router();
const driversController = new TodosController();

router.get('/drivers', driversController.get);

/**
 * router.get('/pubkey', async (request: Request, res: Response, next: NextFunction) => {
	try {
		const publicKey = await loadPublicKey();
		res.send(Buffer.from(publicKey).toString('base64'));
	} catch {
		next(new HttpException(500, 'Internal server error.'));
	}
});
 */

export default router;

//export { router as AgentsGetRouter };