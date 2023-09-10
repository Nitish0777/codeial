//we need two models to access here
const Comment = require("../models/comment");

const Post = require("../models/post");

//import the mailer
const commentsMailer = require("../mailers/comments_mailer");

//import the workers
const commentEmailWorker = require("../workers/comment_email_worker");
const queue = require("../config/kue");

// module.exports.createComment = async(req,res)=>{
//     //in html web page id is showing
//     //so we don't want to any one change the id and make our code error
//     //so we validate or check
//     //...we find the id with the postId first
//     //then create the comment after
//     //why req.body.post bcz name of this form is post in home.ejs
//     try{
//         const cPost = await Post.findById(req.body.post);
//         if(cPost){
//             //if post is found we create the comment
//             Comment.create({
//                 content: req.body.content,
//                 post:req.body.post,
//                 user:req.user._id,
//             },async(err,comment)=>{
//                 try{
//                     //update the comment
//                     //this is given by mongodB
//                     cPost.comments.push(comment);
//                     //when ever i update i need to save to
//                     cPost.save();

//                     res.redirect('/');

//                 }catch(err){
//                     console.log(err);
//                 }
//             })

//         }
//     }catch(err){
//         console.log(err);
//     }

// }

module.exports.createComment = async (req, res) => {
  try {
    //postSchema id store here
    let cPost = await Post.findById(req.body.post);
    if (cPost) {
      //if post present the create comment related to it
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      //storing the comment in the dB
      cPost.comments.push(comment);
      //after storing we need to save it
      await cPost.save();

      comment = await comment.populate({ path: "user", select: "name email" });
     
      //ajax call happen there for the dynamic comment done
      if (req.xhr) {
        //similar for comments to fetch the user's id!
        // comment = await comment.populate({ path: "user", select: "name" });

        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Post created!",
        });
      }

      req.flash("success", `Commented!`);
      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", `check the error ${err} `);

    console.log(err);
  }
};

//deleting the comment

module.exports.destroyComment = async (req, res) => {
  try {
    //find the comment which you want to delete
    let commentStore = await Comment.findById(req.params.id);
    // console.log('hii');
    //req.user.id is the main id when we signIn /signUP create..........
    if (commentStore.user == req.user.id) {
      //before deleting the comment we need to fetch the post id of the comment
      //bcz we need to go inside that post and find the comment and delete it...
      let postIdComment = commentStore.post;

      //then we delete it
      await commentStore.deleteOne();

      //todo later write it...
      let storePost = await Post.findByIdAndUpdate(postIdComment, {
        $pull: { comments: req.params.id },
      });

      //CHANGE:destroy associated  likes for this comment
      await Like.deleteMany({ likeable: commentStore._id, onModel: "Comment" });

      //ajax call bcz Dynamic
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Post deleted",
        });
      }

      // req.flash('success','Comment Deleted!');

      if (storePost) {
        req.flash("success", `comment deleted! `);
        return res.redirect("back");
      }
    } else {
      req.flash("error", `You can't delete this comment....`);
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", `check the error ${err} `);
    return res.redirect("back");
  }
};
