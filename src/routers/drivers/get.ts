import { Router, Request, Response, NextFunction, request } from 'express';
import { driversBySeason, topThreeInSeason } from '../../dbconfig/dbconnector';


const router = Router();
// const driversController = new TodosController();

// router.get('/', driversController.get);


router.get('/', async (request: Request, res: Response) => {
    const year: number = parseInt(request.query.season as string);

    try {

        const drivers = await driversBySeason(year);
        res.send({ success: true, drivers: drivers }); return;

    } catch (e: any) {
        console.log(e.toString());
        res.send({ error: e.toString() }); return;
    }
});


export { router as driversGetRouter };