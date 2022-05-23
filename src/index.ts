// import express from 'express';
// import * as bodyParser from 'body-parser';

// class App {

//     public express: express.Application;

//     constructor() {
//         this.express = express();
//         this.middleware();
//         this.routes();
//     }

//     // Configure Express middleware.
//     private middleware(): void {
//         this.express.use(bodyParser.json());
//         this.express.use(bodyParser.urlencoded({ extended: false }));
//     }

//     private routes(): void {

//         this.express.use('/', (req,res,next) => {
//             res.send("Typescript App works!!!");
//         });
//     }
// }

// export default new App().express;


// import server from './server';

// const port = parseInt(process.env.PORT || '4000');

// const starter = new server().start(port)
//   .then(port => console.log(`Running on port ${port}`))
//   .catch(error => {
//     console.log(error)
//   });

// export default starter;

import app from './Server';

// // Start the server
// const port = Number(process.env.PORT || 8080);

// app.listen(port, () => {
// 	// logger.info('Express server started on port: ' + port);
//     console.log('Express server started on port: ' + port);
// });

