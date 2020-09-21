const express = require('express'),
    ObjectID = require('mongodb').ObjectID,
    router = express.Router(),// new instance of express router
    Post = require('../models/posts'),
    User = require('../models/users');


//-- posts page / index
router.get('/', (req, res) => {
    Post.find({}, function (err, allData) {
        if (err) {
            console.log(err);
        } else {
            //console.log(allData);
            res.render('posts/index', { posts: allData });
        }
    })
})

//-- post form - for creating new posts
router.get('/new', isLoggedIn, (req, res) => {
    res.render('posts/new');
})

//-- post route
router.post('/', isLoggedIn, (req, res) => {
    //console.log('Current User:', req.user._id)
    //-- create a new post
    // let author = {
    //     id: req.user.id,
    //     username: req.user.username
    // }
    Post.create(req.body, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            //console.log(newlyCreated)
            //-- find user  
            User.findById(new ObjectID(req.user._id), (err, foundData) => {
                if (err) {
                    console.log(err)
                } else {
                    newlyCreated.author.id = req.user.id;
                    newlyCreated.author.username = req.user.username;
                    newlyCreated.save();
                    foundData.posts.push(newlyCreated);
                    foundData.save();
                    res.redirect(`/posts/user/${req.user._id}`);
                    // console.log(newlyCreated)
                }
                // console.log(foundData)
            })
            //-- add posts to user
            //-- redirect to posts route
        }
    })
})

//-- show route - show detail of individual post
router.get('/:id', (req, res) => {
    Post.findById(new ObjectID(req.params.id)).populate('comments').exec(function (err, foundData) {
        // User.find({ name: 'Thava' }, null, { sort: { name: 1 } })
        //console.log(foundData);
        if (err) {
            console.log(err);
        } else {
            res.render('posts/show1', { post: foundData })
        }
    })
})

//-- middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


module.exports = router;