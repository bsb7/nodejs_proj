const express = require('express'),
    User = require('../models/users'),
    passport = require('passport'),
    router = express.Router();


//-- landing page
router.get('/', (req, res) => {
    res.render('landing');
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