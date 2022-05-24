
import { Pool } from 'pg';
import * as path from 'path';


const BASE_PATH = 'C:\\shelly\\opora\\csv'
const TABLE_NAMES = ['status', 'seasons', 'circuits', 'constructors', 'drivers', 'races', 'constructor_results', 'constructor_standings', 'driver_standings', 'lap_times', 'pit_stops', 'qualifying', 'results'];

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
        /**
         * create tables: status, seasons, circuits, constructors and drivers
         */
        await pool.query(`CREATE TABLE ${TABLE_NAMES[0]} (
            statusId INTEGER NOT NULL,
            status TEXT,
            PRIMARY KEY (statusId)
        );
        CREATE TABLE ${TABLE_NAMES[1]}(
            year INTEGER NOT NULL,
            url TEXT,
            PRIMARY KEY (year)
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
        );`)

        //create races table
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
            FOREIGN KEY(circuitId) REFERENCES circuits(circuitId),
            FOREIGN KEY(year) REFERENCES seasons(year)
        ); 
        `);

        //Create tables: constructor_results, constructor_standings, driver_standings, lap_times, pit_stops, qualifying and results.
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
    try {
        let sqlStatement = ``;
        TABLE_NAMES.map(table => {
            const filePath = path.join(BASE_PATH, table) + '.csv';
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

/**

 * @returns List of seasons with the top 3 drivers in each season.
 */
export async function topThreeInSeason() {
    const { rows } = await pool.query(`select year, driverId, wins
    from (
    select year, driverid, wins, indexInYear
        from (select races.raceId, year, driverId, points, wins, ROW_NUMBER() OVER (PARTITION BY year Order by wins DESC) AS indexInYear
                   from races 
        join driver_standings on driver_standings.raceid=races.raceid 
        order by year) as q1
        ) as results
        where indexInYear <= 3`);

    return rows;
}

/**
 * @param field Specifies the requested field to query the data by (driverId or surname)
 * @param value The value of the specified field 
 * @param surname needed only if the user chose to query the info by the drivers name, 
 * @returns Driver's profile with all of hisr races sorted from the newest to the oldest. for each race the following columns: 
 *          Average lap time, fastest lap time, sowest lap time, number of pit stops, fastest pit stop, slowest pit stop, circuit nane, points, position.
 */
export async function driverProfile(field: string, value: string, surname?: string) {
    let sqlStatement = `select driver_standings.driverid, races.raceId, races.year, q.fastestLap, q.avgLapTime, q.slowestLapTime, q.pitStopsCount, q.fastestPitStop, q.slowestPitStop, circuits.name, driver_standings.points, driver_standings."position"
    from drivers
    join driver_standings on driver_standings.driverId = drivers.driverid
    join races on races.raceid=driver_standings.raceid
    join circuits on circuits.circuitid=races.circuitid
    join (select lap_times.raceId, min(lap_times.milliseconds) as fastestLap, avg(milliseconds)::numeric(10,4) as avgLapTime, max(lap_times.milliseconds) as slowestLapTime,
        pitStopsQuery.pitStopsCount, pitStopsQuery.fastestPitStop, pitStopsQuery.slowestPitStop
          from lap_times
          left join 
          (select pit_stops.raceid as raceid, count(*) as pitStopsCount , 
           min(milliseconds) as fastestPitStop, max(milliseconds) as slowestPitStop  
           from pit_stops group by pit_stops.raceid) as pitStopsQuery
          on pitStopsQuery.raceid=lap_times.raceid
        group by lap_times.raceid, pitStopsQuery.pitStopsCount, pitStopsQuery.fastestPitStop, pitStopsQuery.slowestPitStop
    ) q on q.raceid=races.raceid `

    if (field.toLocaleLowerCase() === 'driverid') {
        sqlStatement += `where drivers.driverId =${value}`;
    } else if (field.toLocaleLowerCase() === 'forename' && surname) {
        sqlStatement += `where LOWER(drivers.forename) like '${value.toLocaleLowerCase()}' and LOWER(drivers.surname) like '${surname.toLocaleLowerCase()}'`;
    } else {
        throw ("Invalid Parameters"); return;
    }
    sqlStatement += `order by races.year desc;`;
    const { rows } = await pool.query(sqlStatement)

    return rows;
}
