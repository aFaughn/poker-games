const router = require('express').Router()

router.get('/',function(req,res) {
    res.json({Message: 'Hello from "/"!!', RequestBody: req.body})
})

module.exports = router;
