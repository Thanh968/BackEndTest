const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const dotenv = require('dotenv');
const route = require('./route');

dotenv.config();
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// connect to mongodb
require('./dbs/init.db');


// routes

app.use('/api/v1', route);

// handling error

app.use((req, res, next) => {
    const error = new Error("error");
    error.statusCode = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';

    return res.status(statusCode).json({
        message: message,
        status: 'error',
    });
})

module.exports = app;