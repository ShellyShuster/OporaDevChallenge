import express, { Application, Router, Request, Response, NextFunction, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import pool, { createTables, loadDataFromFiles } from './dbconfig/dbconnector';
import { StatusPostRouter } from './routers/status/post';
import { driversGetRouter } from './routers/./drivers/get';
import { seasonsGetRouter } from './routers/seasons/get';

const app = express();


app.use(bodyParser.json({ limit: '2mb' }));

// app.use((request: Request, res: Response, next: NextFunction) => {
//     console.log("check");
//     request.pool = pool;
// })

app.get("/", (req, res) => {
    res.json({ message: "Welcome to attack explorer application." });
});


app.use('/status', [StatusPostRouter]);
app.use('/drivers', [driversGetRouter]);
app.use('/seasons', [seasonsGetRouter]);

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
