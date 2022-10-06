const express = require('express');
const router = express.Router();

router.get('/', function(req,res) {
    // Set csrf protection cookie
    res.cookie('XSRF-TOKEN', req.csrfToken());
    // send back a cute message as a plain text response.
    res.send('Hello World!');
});

module.exports = router;
