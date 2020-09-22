const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    methodOverride = require('method-override'),
    LocalStrategy = require('passport-local'),
    ObjectID = require('mongodb').ObjectID,
    User = require('./models/users'),
    Post = require('./models/posts'),
    Comment = require('./models/comments'),
    seedDB = require('./seed'),
    app = express();

const commentRoutes = require('./routes/comments'),
    postsRoutes = require('./routes/posts'),
    authRoutes = require('./routes/auth'),
    userRoutes = require('./routes/user');

//seedDB();
const port = process.env.PORT || 8000;

//-- use mongoose to connect to the database
mongoose.connect('mongodb://localhost/posts_v1', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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
app.use(authRoutes);
app.use('/posts/:id/comments', commentRoutes);
app.use('/posts', postsRoutes);
app.use(userRoutes);

app.listen(port, () => console.log(`Server is listening to port: ${port}`));