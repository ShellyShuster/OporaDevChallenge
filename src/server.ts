import express, { Application, Router, Request, Response, NextFunction, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import driversRouter from './routers/DriversRouter';
import pool, { createTables, loadDataFromFiles } from './dbconfig/dbconnector';
import { Pool, PoolClient } from 'pg';
import { StatusPostRouter } from './routers/status/post';
import { getRouter } from './routers/get';

const app = express();

// const databaseConn = connectToDatabase();

// declare global {
//     namespace Express{
//         export interface Request {
//             pool: Pool;
//         }
//     }
// }
app.use(bodyParser.json({ limit: '2mb' }));

// app.use((request: Request, res: Response, next: NextFunction) => {
//     console.log("check");
//     request.pool = pool;
// })

app.get("/", (req, res) => {
    res.json({ message: "Welcome to attack explorer application." });
});


app.use('/status', [StatusPostRouter]);
app.use('/drivers', [getRouter]);

// Start the server
const port = Number(process.env.PORT || 9000);

app.listen(port, () => {
    const func = async () => {
        console.log('Express server started on port: ' + port);
        const { rows } = await pool.query(`select count(*) from pg_catalog.pg_tables 
        where schemaname != 'pg_catalog' and 
        schemaname != 'information_schema';`);
        const tablesNum = parseInt(rows[0].count);
        console.log({ tablesNum });
        if (tablesNum === 0) {
            await createTables();
            await loadDataFromFiles();
        } else {
            console.log("database was aready created :)");
        }
    }
    func();
});


export default app;

// class Server {
//     private app;

//     constructor() {
//         this.app = express();
//         this.config();
//         this.routerConfig();
//         // this.dbConnect();
//     }

//     private config() {
//         this.app.use(bodyParser.urlencoded({ extended:true }));
//         this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
//     }

//     // private dbConnect() {
//     //     pool.connect(function (err, client, done) {
//     //         if (err) throw new Error(err.toString());
//     //         console.log('Connected');
//     //       });
//     // }

//     private routerConfig() {
//         this.app.use('/drivers', todosRouter);
//     }

//     public start = (port: number) => {
//         return new Promise((resolve, reject) => {
//             this.app.listen(port, () => {
//                 resolve(port);
//             }).on('error', (err: Object) => reject(err));
//         });
//     }
// }

// export default Server;