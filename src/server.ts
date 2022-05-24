import express from 'express';
import bodyParser from 'body-parser';
import pool, { createTables, loadDataFromFiles } from './dbconfig/dbconnector';
import { driversGetRouter } from './routers/./drivers/get';
import { seasonsGetRouter } from './routers/seasons/get';

const app = express();


app.use(bodyParser.json({ limit: '2mb' }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to attack explorer application." });
});


app.use('/drivers', [driversGetRouter]);
app.use('/seasons', [seasonsGetRouter]);

// Start the server
const port = Number(process.env.PORT || 9000);

app.listen(port, () => {
    const initDb = async () => {
        console.log('Express server started on port: ' + port);
        const { rows } = await pool.query(`select count(*) from pg_catalog.pg_tables 
        where schemaname != 'pg_catalog' and 
        schemaname != 'information_schema';`);
        const tablesNum = parseInt(rows[0].count);
        if (tablesNum === 0) {
            await createTables();
            await loadDataFromFiles();
        }
    }
    initDb();
});


export default app;
