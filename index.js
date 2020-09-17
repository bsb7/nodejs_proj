const e = require('express');
const { response } = require('express');

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    ObjectID = require('mongodb').ObjectID,
    User = require('./models/users'),
    Post = require('./models/posts'),
    Comment = require('./models/comments'),
    seedDB = require('./seed'), 
    app = express();

//seedDB();
const port = process.env.PORT || 8000;

//-- use mongoose to connect to the database
mongoose.connect('mongodb://localhost/posts_v1', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


//-- passport config
app.use(require('express-session')({
    secret: 'testapp',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})
//========================ROUTE========================

//-- landing page
app.get('/', (req, res) => {
    res.render('landing');
})

//-- posts page / index
app.get('/posts', (req, res) => {
    Post.find({}, function (err, allData) {
        if (err) {
            console.log(err);
        } else {
            //console.log(allData);
            res.render('posts/index', { posts: allData});
        }
    })
})

//-- post form - for creating new posts
app.get('/posts/new', (req, res) => {
    res.render('posts/new');
})

//-- post route
app.post('/posts', (req, res) => {
    //console.log('Current User:', req.user._id)
    //-- create a new post
    Post.create(req.body, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            //console.log(newlyCreated)
            //-- find user  
            User.findById(new ObjectID(req.user._id),(err, foundData)=>{
                if (err) {
                    console.log(err)
                } else {
                    foundData.posts.push(newlyCreated);
                    foundData.save();
                    res.redirect(`/posts/user/${req.user._id}`);
                }
                // console.log(foundData)
            })
            //-- add posts to user
            //-- redirect to posts route
        }
    })
})

//-- show route - show detail of individual post
app.get('/posts/:id', (req, res) => { 
    Post.findById(new ObjectID((req.params.id))).populate('comments').exec(function (err, foundData) {
        //console.log(foundData);
        if (err) {
            console.log(err);
        } else {
            res.render('posts/show1', {post: foundData})
       }
   })
})


//==============================
// COMMENTS ROUTE
//==============================

//- new  comment form
app.get('/posts/:id/comments/new', isLoggedIn, (req, res) => {
    //-- find post by id
    Post.findById(new ObjectID(req.params.id), (err, foundData) => {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/new', {post:foundData});            
        }
    })

})

//- post route
app.post('/posts/:id/comments',isLoggedIn, (req, res) => {
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
                    // connect new comment to post
                    foundData.comments.push(newlyCreatedComment);
                    // save the post with comment
                    foundData.save();
                    // redirect to /posts
                    res.redirect(`/posts/${foundData._id}`);
                }
            })
        }
    })
})


//==============================
// AUTH ROUTE
//==============================

//-- register route
app.get('/register', (req, res) => {
    res.render('register');
})

//-- handle sign up logic
app.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, newlyCreatedUser) {
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
app.get('/login', (req, res) => {
    res.render('login');
})

//-- handle login logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/login'
}), (req, res) => {})

//-- add logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/posts');
})

//-- middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


//==============================
// USER ROUTE
//==============================

app.get('/posts/user/:userId', (req, res) => {
    //console.log(req.params.userId)
    User.findById(new ObjectID(req.params.userId)).populate('posts').exec(function(err, foundData){
        if (err) {
            console.log(err);
        } else {
            res.render('user/show', { user: foundData });
            // console.log(foundData);
        }
    })
    
})

app.listen(port, () => console.log(`Server is listening to port: ${port}`));