const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    ObjectID = require('mongodb').ObjectID,
    Post = require('./models/posts'),
    seedDB = require('./seed'), 
    app = express();

//seedDB();
const port = process.env.PORT || 8000;

//-- use mongoose to connect to the database
mongoose.connect('mongodb://localhost/posts_v1', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

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
            res.render('posts/index', { posts: allData });
        }
    })
})

//-- post form - for creating new posts
app.get('/posts/new', (req, res) => {
    res.render('posts/new');
})

//-- post route
app.post('/posts', (req, res) => {
    //-- create a new post
    Post.create(req.body, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            //console.log(newlyCreated)
            //-- redirect to posts route
            res.redirect('/posts');
        }
    })
})

//-- show route - show detail of individual post
app.get('/posts/:id', (req, res) => { 
    Post.findById(new ObjectID((req.params.id))).populate('comments').exec(function (err, foundData) {
        console.log(foundData);
        if (err) {
            console.log(err);
        } else {
            res.render('posts/show', {post: foundData})
       }
   })
})

app.listen(port, () => console.log(`Server is listening to port: ${port}`));