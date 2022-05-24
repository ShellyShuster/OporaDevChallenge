import { Router, Request, Response } from 'express';
import { topThreeInSeason } from '../../dbconfig/dbconnector';


const router = Router();

router.get('/topDrivers', async (request: Request, res: Response) => {
    try {
        const result = await topThreeInSeason();
        res.send({ success: true, seasons: result }); return;
    } catch (e: any) {
        console.log(e.toString());
        res.send({ error: e.toString() }); return;
    }
})

export { router as seasonsGetRouter };