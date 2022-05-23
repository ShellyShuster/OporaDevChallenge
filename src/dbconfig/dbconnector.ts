
import { Pool } from 'pg';

const pool = new Pool({
    max: 20,
    connectionString: 'postgres://postgres:123456@localhost:5432/Drivers',
    idleTimeoutMillis: 30000
});

export default pool;

export async function createTables() {
    try {
        await pool.query(`CREATE TABLE status (
            statusId INTEGER NOT NULL,
            status TEXT,
            PRIMARY KEY (statusId)
        );
        CREATE TABLE seasons(
            year INTEGER NOT NULL,
            url TEXT
        ); 
        CREATE TABLE circuits(
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
        CREATE TABLE constructors(
            constructorId INTEGER,
            constructor TEXT,
            name TEXT,
            nationality TEXT,
            url TEXT,
            PRIMARY KEY(constructorId)
        );
        CREATE TABLE drivers(
            driverId INTEGER,
            driverRef TEXT,
            number INTEGER,
            code VARCHAR(3),
            forename TEXT,
            surname TEXT,
            dob TEXT,
            nationality TEXT,
            url TEXT,
            PRIMARY KEY(driverId)
        ); `)

        await pool.query(`
        CREATE TABLE races(
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
        console.log("after creating races");

        await pool.query(`CREATE TABLE constructor_results(
            constructorResultId INTEGER,
            raceId INTEGER,
            constructorId INTEGER,
            points INTEGER,
            status INTEGER,
            PRIMARY KEY(constructorResultId),
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(constructorId) REFERENCES constructors(constructorId),
            FOREIGN KEY(status) REFERENCES status(statusId)
        ); 
        CREATE TABLE constructor_standings(
            constructorStandingsId INTEGER,
            raceId INTEGER,
            constructorId INTEGER,
            points INTEGER,
            status INTEGER,
            position INTEGER,
            positionText VARCHAR(5),
            wins INTEGER,
            PRIMARY KEY(constructorStandingsId),
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(constructorId) REFERENCES constructors(constructorId),
            FOREIGN KEY(status) REFERENCES status(statusId)
        );
        CREATE TABLE driver_standings(
            driverStandingsId INTEGER,
            raceId INTEGER,
            driverId INTEGER,
            points INTEGER,
            position INTEGER,
            positionText VARCHAR(5),
            wins INTEGER,
            PRIMARY KEY(driverStandingsId),
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(driverId) REFERENCES drivers(driverId)
        );
        CREATE TABLE lap_times(
            raceId INTEGER,
            driverId INTEGER,
            lap INTEGER,
            position INTEGER,
            time TEXT,
            milliseconds INTEGER,
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(driverId) REFERENCES drivers(driverId)
        );  
        CREATE TABLE pit_stops(
            raceId INTEGER,
            driverId INTEGER,
            stop INTEGER,
            lap INTEGER,
            time TEXT,
            duration FLOAT,
            milliseconds INTEGER,
            FOREIGN KEY(raceId) REFERENCES races(raceId),
            FOREIGN KEY(driverId) REFERENCES drivers(driverId)
        ); 
        CREATE TABLE qualifying(
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
        CREATE TABLE results(
            resultId INTEGER,
            raceId INTEGER,
            driverId INTEGER,
            constructorId INTEGER,
            number INTEGER,
            grid INTEGER,
            position INTEGER,
            positionText TEXT,
            positionOrder INTEGER,
            points INTEGER,
            laps INTEGER,
            time TEXT,
            milliseconds INTEGER,
            fastestLap INTEGER,
            rank INTEGER,
            fastestLapTime TEXT,
            fastestLapSpeed float,
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