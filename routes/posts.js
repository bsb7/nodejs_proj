const express = require('express'),
    ObjectID = require('mongodb').ObjectID,
    router = express.Router(),// new instance of express router
    middleware = require('../middleware/index'),
    Post = require('../models/posts'),
    User = require('../models/users');


//-- posts page / index
router.get('/', (req, res) => {
    Post.find({}, function (err, allData) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts/index', { posts: allData });
        }
    })
})

//-- post form - for creating new posts
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('posts/new');
})

//-- post route
router.post('/', middleware.isLoggedIn, (req, res) => {
    Post.create(req.body, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
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
                }
            })
        }
    })
})

//-- show route - show detail of individual post
router.get('/:id', (req, res) => {
    Post.findById(new ObjectID(req.params.id)).populate('comments').exec(function (err, foundData) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts/show1', { post: foundData })
        }
    })
})


// edit posts
router.get('/:id/edit', (req, res) => {
    // console.log(req.params.id);
    Post.findById(new ObjectID(req.params.id), (err, foundData) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(foundData);
            res.render('posts/edit', { post: foundData });
        }
    })
})

// handle edit logic
router.put('/:id', (req, res) => {
    // console.log(req.body.post);
    Post.findByIdAndUpdate(new ObjectID(req.params.id), req.body.post, (err, updatedData) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect(`/posts/${updatedData._id}`);
        }
    })
})
// update posts


module.exports = router;