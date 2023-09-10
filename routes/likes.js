
//every time when we create express it will not make new instance
//it will just fetch the existing instance
const express = require('express');

//this will help in separate myApp.router and my controller
const router = express.Router();

//connected to the  controllers
const likesController = require('../controllers/likes_controller');

/* /likes/toggle/.. */
router.post('/toggle',likesController.toggleLike);

module.exports = router;