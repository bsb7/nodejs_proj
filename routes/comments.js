const express = require('express'),
    ObjectID = require('mongodb').ObjectID,
    Post = require('../models/posts'),
    Comment = require('../models/comments'),
    middleware = require('../middleware'),
    router = express.Router({ mergeParams: true });

//==============================
// COMMENTS ROUTE
//==============================

//- new  comment form
router.get('/new', middleware.isLoggedIn, (req, res) => {
    //-- find post by id
    Post.findById(req.params.id, (err, foundData) => {
        if (err) {
            console.log(err)
        } else {
            console.log(foundData)
            res.render('comments/new', { post: foundData });
        }
    })

})

//- post route
router.post('/', middleware.isLoggedIn, (req, res) => {
    // find post using id
    Post.findById(new ObjectID(req.params.id), (err, foundData) => {
        if (err) {
            console.log(err);
            //redirect to /posts
            res.redirect('/posts');
        } else {
            //console.log(req.body.comment);
            // create new comment
            Comment.create(req.body.comment, (err, newlyCreatedComment) => {
                if (err) {
                    console.log(err)
                } else {
                    //add username and id to comment
                    console.log(req.user.username)
                    // connect new comment to post
                    newlyCreatedComment.author.id = req.user.id;
                    newlyCreatedComment.author.username = req.user.username;
                    newlyCreatedComment.save();
                    foundData.comments.unshift(newlyCreatedComment);
                    // save the post with comment
                    foundData.save();
                    // console.log(newlyCreatedComment)
                    // redirect to /posts
                    res.redirect(`/posts/${foundData._id}`);
                }
            })
        }
    })
})



module.exports = router;