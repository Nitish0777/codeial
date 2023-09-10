const express = require("express");

const router = express.Router();

//i need there this bcz we need to check that no one can post without signIn 
//for checking purpose we need to check using passport authentication
const passport = require("passport");

// import the post_controller file here 
const postsController  = require('../controllers/post_controller');

//we user here checkAuthentication bcz we need to take care that no other then who signIn can post

router.post('/createPost',passport.checkAuthentication,postsController.createPost);


//create a router for deleting post and associated comments
router.get('/destroyPost/:id',passport.checkAuthentication,postsController.destroyPost);

module.exports = router;