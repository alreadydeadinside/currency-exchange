import express from 'express';
import createRoutes from './loaders/index.js';
import config from './config/index.js';

function startServer() {
    const app = express();
    createRoutes(app);
    console.info(`Listening on port http://localhost:${config.port}`);

    app.listen(config.port);
}

startServer();
