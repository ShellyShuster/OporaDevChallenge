import { Router, Request, Response } from 'express';
import { driverProfile, driversBySeason } from '../../dbconfig/dbconnector';


const router = Router();


router.get('/profile', async (request: Request, res: Response) => {
    const driverId: string = request.query.driverId as string;
    const forename: string = request.query.forename as string;
    const surname: string = request.query.surname as string;
    try {
        if (driverId) {
            const profile = await driverProfile('driverid', driverId);
            res.send({ success: true, profile });
        } else if (forename) {
            const profile = await driverProfile('forename', forename, surname);
            res.send({ success: true, profile });
        }
        else {
            res.send({ error: "Invalid query params" });
        }

    } catch (e: any) {
        console.log(e.toString());
        res.send({ error: e.toString() }); return;
    }
});



router.get('/', async (request: Request, res: Response) => {
    const year: number = parseInt(request.query.season as string);
    try {
        if (year) {
            const drivers = await driversBySeason(year);
            res.send({ success: true, drivers: drivers }); return;
        } else {
            res.send({ error: "Invalid parameters" });    
        }

    } catch (e: any) {
        console.log(e.toString());
        res.send({ error: e.toString() }); return;
    }
});



export { router as driversGetRouter };