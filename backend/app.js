const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Checks if the currently loaded environment is dev or production
const { environment } = require('./config');
const isProduction = environment === 'production';

// Initialize Express application
const app = express();

// Connect morgan for logging in the dev environment
app.use(morgan('dev'));

// Parses cookies
app.use(cookieParser());

// Parses JSON bodies in requests
app.use(express.json());

//Security Middleware
if (!isProduction) {
    app.use(cors())
}

// Helmet sets a bunch of different headers to Req/Res to improve security
app.use(helmet({
    contentSecurityPolicy: false
}))

// Set a _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && 'Lax',
            httpOnly: true,
        },
    })
);

//Point to the routes file for app
const routes = require('./routes')
app.use(routes)

// Error Handling middle-ware
const { ValidationError } = require('sequelize')

// 404
app.use((_req, _res, next) => {
    const err = new Error('The requested resource couldn\'t be found.');
    err.title = "Resource Not Found"
    err.errors = ["The requested resource could not be found."]
    err.status = 404;
    next(err);
})

app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

module.exports = app;
