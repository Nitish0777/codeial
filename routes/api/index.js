//this is the root index of the API routes



//every time when we create express it will not make new instance
//it will just fetch the existing instance
const express = require('express');

//this will help in separate myApp.router and my controller
const router = express.Router();


//let's define the version v1 index.js

router.use('/v1',require('./v1'));


module.exports = router;