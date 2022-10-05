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
