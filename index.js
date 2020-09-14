const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();
const port = process.env.PORT || 8000;

//-- use mongoose to connect to the database
mongoose.connect('mongodb://localhost/posts_v1', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


//-- setup schema
const postsSchema = new mongoose.Schema({
    title: String,
    image: String
})

//-- save schema to a model
const Post = new mongoose.model('Post', postsSchema);

//========================ROUTE========================

//-- landing page
app.get('/', (req, res) => {
    console.log('This is the roote page!');
    res.render('landing');
})

//-- posts page / index
app.get('/posts', (req, res) => {
    Post.find({}, function (err, allData) {
        if (err) {
            console.log(err);
        } else {
            console.log(allData);
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
            console.log(newlyCreated)
            //-- redirect to posts route
            res.redirect('/posts');
        }
    })
})


app.listen(port, () => console.log(`Server is listening to port: ${port}`));