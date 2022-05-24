import { Router, Request, Response, NextFunction, request } from 'express';
import pool from '../../dbconfig/dbconnector'
// import HttpException from 'src/exceptions/HttpException';
// import TodosController from '../controllers/DriversController';


const router = Router();
// const driversController = new TodosController();

// router.get('/', driversController.get);


router.post('/', async (request: Request, res: Response, next: NextFunction) => {
    try {
        pool.query(`CREATE TABLE status (
            statusId INTEGER,
            status TEXT
        );`)
        pool.query(`COPY status(statusId, status)
        FROM 'C:\\shelly\\opora\\csv\\status.csv' 
        DELIMITER ','
        CSV HEADER;`)
        // res.send(Buffer.from(publicKey).toString('base64'));

        res.send({success: true});
        

    } catch (e: any){
        // next(new HttpException(500, 'Internal server error.'));
        console.log(e.toString());
    }
});


// export default router;

export { router as StatusPostRouter };