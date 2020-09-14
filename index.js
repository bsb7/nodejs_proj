const express = require('express'),
    bodyParser = require('body-parser'),
    app = express();
const port = process.env.PORT || 8000;


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

const data = [
    {
        title: 'Greenest Leaves',
        image: 'https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
    },
    {
        title: 'Paradise Island',
        image: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
    },
    {
        title: 'Mountanous Top',
        image: 'https://images.pexels.com/photos/2835562/pexels-photo-2835562.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
    },
]
//-- landing page
app.get('/', (req, res) => {
    console.log('This is the roote page!');
    res.render('landing');
})

//-- post form
app.get('/posts/new', (req, res) => {
    res.render('posts/new');
})

//-- posts page / index
app.get('/posts', (req, res) => {
    res.render('posts/index', { posts: data });
})

//-- post route
app.post('/posts', (req, res) => {
    // get data from form and add to post array
    data.push(req.body);
    // redirect to posts page
    res.redirect('/posts');
})


app.listen(port, () => console.log(`Server is listening to port: ${port}`));