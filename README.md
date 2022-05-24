# OporaDevChallenge



In order to execute the project you will have to perfrom few steps:
  1. run ```npm install``` to install the dependencies.
  2. Add the csv files' directory next to OporaDevChallenge directory and change the "BASE_PATH" variable in ```dbconnector.ts``` to contain the file to the csvs directory.
  3. Create a postgresql dataase named ```Drivers```.
  4. Change the pool's connetctionString to fit to your DB's parameters in ```dbconnector.ts``` file.
  5. Run the project by typing ```npm run dev```

### REST API
#### Drivers by season - returns a list of drivers sorted by the wins in the requested season. 
  send get request to http://localhost:9000/drivers?season=requestedYear
  
  ##### Output Example:
    {
    "success": true,
    "drivers": [
        {
            "driverid": 2,
            "driverref": "heidfeld",
            "number": "\\N",
            "code": "HEI",
            "forename": "Nick",
            "surname": "Heidfeld",
            "dob": "1977-05-09T22:00:00.000Z",
            "nationality": "German",
            "url": "http://en.wikipedia.org/wiki/Nick_Heidfeld",
            "wins": 0,
            "year": 2005
        },
        {
            "driverid": 4,
            "driverref": "alonso",
            "number": "14",
            "code": "ALO",
            "forename": "Fernando",
            "surname": "Alonso",
            "dob": "1981-07-28T22:00:00.000Z",
            "nationality": "Spanish",
            "url": "http://en.wikipedia.org/wiki/Fernando_Alonso",
            "wins": 0,
            "year": 2005
        }
    ]}

####	Seasons all-time ranking: returns a list of seasons with the top 3 drivers in each season
  send get request to http://localhost:9000/seasons/topDrivers
  ##### Output Example:
    {
    "success": true,
    "seasons": [
        {
            "year": 1950,
            "driverid": 579,
            "wins": 3
        },
        {
            "year": 1950,
            "driverid": 642,
            "wins": 3
        },
        {
            "year": 1950,
            "driverid": 579,
            "wins": 3
        },
        {
            "year": 1951,
            "driverid": 579,
            "wins": 3
        },
        {
            "year": 1951,
            "driverid": 579,
            "wins": 2
        },
        {
            "year": 1951,
            "driverid": 647,
            "wins": 2
        }
    ]}
    
####	Driver profile: Get a specific driver (by id/name) with all of his races sorted by date from newest to the oldest
  send get request to http://localhost:9000/drivers/profile?driverId=requestedDriverId or to http://localhost:9000/drivers/profile?forename=firstName&surname=lastName
  
  ##### Output Example:
    {
    "success": true,
    "profile": [
        {
            "driverid": 1,
            "raceid": 1060,
            "year": 2021,
            "fastestlap": 66200,
            "avglaptime": "72039.0913",
            "slowestlaptime": 120589,
            "pitstopscount": "27",
            "fastestpitstop": 20841,
            "slowestpitstop": 27122,
            "name": "Red Bull Ring",
            "points": 150,
            "position": 2
        },
        {
            "driverid": 1,
            "raceid": 1059,
            "year": 2021,
            "fastestlap": 96404,
            "avglaptime": "100615.9591",
            "slowestlaptime": 123242,
            "pitstopscount": "22",
            "fastestpitstop": 29682,
            "slowestpitstop": 31457,
            "name": "Circuit Paul Ricard",
            "points": 119,
            "position": 2
        },
        {
            "driverid": 1,
            "raceid": 1058,
            "year": 2021,
            "fastestlap": 67058,
            "avglaptime": "71218.4522",
            "slowestlaptime": 123661,
            "pitstopscount": "24",
            "fastestpitstop": 20936,
            "slowestpitstop": 46315,
            "name": "Red Bull Ring",
            "points": 138,
            "position": 2
        }
    ]}
    
    
  I really wanted to add authentication, DTO's, custom exceptions and different interfaces but I have very importent physics exam on wednesday and right after it we are going to a school trip so I didn't have enough time, I did my best, hope you like it.
