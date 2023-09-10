//every time when we create express it will not make new instance
//it will just fetch the existing instance
const express = require('express');

//this will help in separate myApp.router and my controller
const router = express.Router();

//v1 post.js file fetch or linked with it...
router.use('/posts',require('./posts'));
router.use('/users',require('./users'));

module.exports = router;