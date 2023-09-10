//enter point of all the routes
//every time when we create express it will not make new instance
//it will just fetch the existing instance
const express = require('express');

//this will help in separate myApp.router and my controller
const router = express.Router();

console.log('router loaded');
// router.get('/',(req,res)=>{})

//*****************************************************************************************//
//get from controller home_controller
//fetching from controllers
const homeController = require('../controllers/home_controller');


//get from controller home_controller//this is access
router.get('/',homeController.home);

//i want that this will be the main head of all routes in routes file
//so for that i will do access to the users.js connect with index.js router
// calling home/users--->
router.use('/users',require('./users'));

//call to the posts.js file
router.use('/posts',require('./posts'));
//$$$$$$$$$$$$$$EXAMPLE$$$$$$$$$$$$$$$$$$$$$$
//for any other routers, access form here
//router.use('/routerName',require('./routerFile'));

//call the comments.js route
router.use('/comments',require('./comments'));



//this is for the like routing
router.use('/likes',require('./likes'));



//@@@@@@@@@@@@@@@@@ Post use
//use post_controller.js connect with index.js router
// router.use('/post_controller',require('./post_controller'));

//now the root of the router file should know the
//API folder has been created and in used ...
//se we link it with API folder
router.use('/api',require('./api'));


// This will export to the index.js so that it will be use by
//index.js
module.exports = router;