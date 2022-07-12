const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

const routes = require('./frameworks/expressSpecific/routes');

const API_PREFIX = process.env.API_PREFIX || '/api/v1';

module.exports = {
    start:() => {

        // Midlewares
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Routes
        app.use(API_PREFIX, routes(dependencies));

        // Common Error handler

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
};

