import { Router, Request, Response, NextFunction, request } from 'express';
import { driversBySeason } from '../dbconfig/dbconnector';


const router = Router();
// const driversController = new TodosController();

// router.get('/', driversController.get);


router.get('/', async (request: Request, res: Response) => {
    const year: number = parseInt(request.query.season as string);

    try {
        
        const drivers = await driversBySeason(year);
        res.send({success: true, drivers: drivers});

    } catch (e: any){
        
        console.log(e.toString());
    }
});


// export default router;

export { router as getRouter };