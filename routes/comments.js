const express = require("express");

const router = express.Router();

//i need there this bcz we need to check that no one can post without signIn 
//for checking purpose we need to check using passport authentication
const passport = require("passport");

// import the post_controller file here 
const commentController  = require('../controllers/comments_controller');

//we user here checkAuthentication bcz we need to take care that no other then who signIn can post

router.post('/createComment',passport.checkAuthentication,commentController.createComment);


//create a routes for deleting the comments
router.get('/destroyComment/:id',passport.checkAuthentication,commentController.destroyComment);


module.exports = router;