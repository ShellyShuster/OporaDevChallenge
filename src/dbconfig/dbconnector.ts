
import { Pool } from 'pg';
import * as path from 'path';
// import x from '../../../csv'

const TABLE_NAMES = ['status', 'seasons', 'circuits', 'constructors', 'drivers', 'races', 'constructor_results', 'constructor_standings', 'driver_standings', 'lap_times', 'pit_stops', 'qualifying', 'results'];
// const TABLE_NAMES = ['status', 'seasons', 'circuits', 'constructors'];
const pool = new Pool({
    max: 20,
    connectionString: 'postgres://postgres:123456@localhost:5432/Drivers',
    idleTimeoutMillis: 30000
});

export default pool;

/**
 * This function executes sql statements that create the different requested tables.
 */
export async function createTables() {
    try {
        await pool.query(`CREATE TABLE ${TABLE_NAMES[0]} (
            statusId INTEGER NOT NULL,
            status TEXT,
            PRIMARY KEY (statusId)
        );
        CREATE TABLE ${TABLE_NAMES[1]}(
            year INTEGER NOT NULL,
            url TEXT
        ); 
        CREATE TABLE ${TABLE_NAMES[2]}(
            circuitId INTEGER NOT NULL,   
            circuitRef TEXT,
            name TEXT,
            location TEXT,
            country TEXT,
            lat FLOAT,
            lng FLOAT,
            alt INTEGER,
            url TEXT,
            PRIMARY KEY(circuitId)
        );
        CREATE TABLE ${TABLE_NAMES[3]}(
            constructorId INTEGER,
            constructorRef TEXT,
            name TEXT,
            nationality TEXT,
            url TEXT,
            PRIMARY KEY(constructorId)
        );
        CREATE TABLE ${TABLE_NAMES[4]}(
            driverId INTEGER,
            driverRef TEXT,
            number VARCHAR(5),
            code VARCHAR(3),
            forename TEXT,
            surname TEXT,
            dob DATE,
            nationality TEXT,
            url TEXT,
            PRIMARY KEY(driverId)
        ); `)

        await pool.query(`
        CREATE TABLE ${TABLE_NAMES[5]}(
            raceId INTEGER,
            year INTEGER,
            round INTEGER,
            circuitId INTEGER,
            name TEXT,
            date TEXT,
            time TEXT,
            url TEXT,
            PRIMARY KEY(raceId),
            FOREIGN KEY(circuitId) REFERENCES circuits(circuitId)
        ); 
        `);

        await pool.query(`CREATE TABLE ${TABLE_NAMES[6]}(
            constructorResultId INTEGER,
            raceId INTEGER,
            constructorId INTEGER,
            points FLOAT,
            status VARCHAR(5),
            PRIMARY KEY(constructorResultId),
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(constructorId) REFERENCES constructors(constructorId)); 

        CREATE TABLE ${TABLE_NAMES[7]}(
            constructorStandingsId INTEGER,
            raceId INTEGER,
            constructorId INTEGER,
            points FLOAT,
            position INTEGER,
            positionText VARCHAR(5),
            wins INTEGER,
            PRIMARY KEY(constructorStandingsId),
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(constructorId) REFERENCES constructors(constructorId)
        );
        CREATE TABLE ${TABLE_NAMES[8]}(
            driverStandingsId INTEGER,
            raceId INTEGER,
            driverId INTEGER,
            points FLOAT,
            position INTEGER,
            positionText VARCHAR(5),
            wins INTEGER,
            PRIMARY KEY(driverStandingsId),
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(driverId) REFERENCES drivers(driverId)
        );
        CREATE TABLE ${TABLE_NAMES[9]}(
            raceId INTEGER,
            driverId INTEGER,
            lap INTEGER,
            position INTEGER,
            time TEXT,
            milliseconds INTEGER,
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(driverId) REFERENCES drivers(driverId)
        );  
        CREATE TABLE ${TABLE_NAMES[10]}(
            raceId INTEGER,
            driverId INTEGER,
            stop INTEGER,
            lap INTEGER,
            time TEXT,
            duration TEXT,
            milliseconds INTEGER,
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(driverId) REFERENCES drivers(driverId)
        ); 
        CREATE TABLE ${TABLE_NAMES[11]}(
            qualifyId INTEGER,
            raceId INTEGER,
            driverId INTEGER,
            constructorId INTEGER,
            number INTEGER,
            position INTEGER,
            q1 TEXT,
            q2 TEXT,
            q3 TEXT,
            PRIMARY KEY(qualifyId),
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(driverId) REFERENCES drivers(driverId),
            FOREIGN KEY(constructorId) REFERENCES constructors(constructorId)
        ); 
        CREATE TABLE ${TABLE_NAMES[12]}(
            resultId INTEGER,
            raceId INTEGER,
            driverId INTEGER,
            constructorId INTEGER,
            number TEXT,
            grid INTEGER,
            position VARCHAR(5),
            positionText TEXT,
            positionOrder INTEGER,
            points FLOAT,
            laps INTEGER,
            time TEXT,
            milliseconds TEXT,
            fastestLap VARCHAR(5),
            rank VARCHAR(3),
            fastestLapTime TEXT,
            fastestLapSpeed TEXT,
            statusId INTEGER,
            PRIMARY KEY(resultId),
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(driverId) REFERENCES drivers(driverId),
            FOREIGN KEY(constructorId) REFERENCES constructors(constructorId),
            FOREIGN KEY(statusId) REFERENCES status(statusId)
        );`)
    } catch (e: any) {
        console.log(e.toString());
    }
}


/**
 * This function load all the information from the CSV files to the DB.
 */
export async function loadDataFromFiles() {
    const basePath = 'C:\\shelly\\opora\\csv'
    try {
        let sqlStatement = ``;
        TABLE_NAMES.map(table => {
            const filePath = path.join(basePath, table) + '.csv';
            console.log({ filePath });
            sqlStatement += `COPY ${table}
             FROM '${filePath}'
             DELIMITER ','
             CSV HEADER; `
        })
        await pool.query(sqlStatement);
    } catch (e: any) {
        console.log(e.toString());
    }
}

/**
 * The function fetches from the DB a list of drivers sorted by their id and their wins is a requested season.
 * @param seasonYear The year of the requested season.
 * @returns list of drivers sorted by their id and their wins is a requested season.
 */
export async function driversBySeason(seasonYear: number) {
    const { rows } = await pool.query(`select DISTINCT drivers.*, driver_standings.wins, races.year
    from driver_standings
    JOIN races on driver_standings.raceId = races.raceId
    join drivers on driver_standings.driverId = drivers.driverId
    where year=${seasonYear}
    order by drivers.driverid asc, driver_standings.wins asc`);
    
    return rows;
}

// export async function connectToDatabase(){
//     // pool.connect(function (err, client, done) {
//     //     if (err) throw new Error(err.toString());
//     //     console.log('Connected');
//     //   });
//     await pool.connect();
//     await pool.end();
// };

// export async function getDatabase() {
//     pool.connect();
//     return pool;
// }