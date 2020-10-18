const express = require('express'),
    User = require('../models/users'),
    Post = require('../models/posts'),
    passport = require('passport'),
    router = express.Router();


//-- landing page
router.get('/', (req, res) => {
    res.render('landing');
})

// search
router.post('/search', (req, res) => {
    // res.send('fjakdfjakl');
    console.log(req.body.text);
    if (!req.body.text) {
        // console.log('no data');
        res.redirect('/posts')
    } else {
        Post.find({ title: { $regex: req.body.text, $options: "i" } }, function (err, foundData) {
            // console.log("Partial Search Begins");
            // console.log(foundData);
            // console.log(foundData.length)
            if (err) {
                console.log(err);
            } else {

                res.render('posts/search');

            }
        });
    }

})


//==============================
// AUTH ROUTE
//==============================

//-- register route
router.get('/register', (req, res) => {
    res.render('register');
})

//-- handle sign up logic
router.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, newlyCreatedUser) {
        if (err) {
            console.log(err)
            res.redirect('register');
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/posts');
        });
    })
})

//-- show login form
router.get('/login', (req, res) => {
    res.render('login');
})

//-- handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/login'
}), (req, res) => { })

//-- add logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/posts');
})



module.exports = router;