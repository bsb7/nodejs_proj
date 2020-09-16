let mongoose = require('mongoose'),
    Comment = require('./models/comments'),
    Post = require('./models/posts');


let data = [
    {
        title: 'Hanging Bridge',
        image: 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`
    },
    {
        title: 'Green Habitat',
        image: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`
    },
    {
        title: 'Misty Forest',
        image: 'https://images.pexels.com/photos/6992/forest-trees-northwestisbest-exploress.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`
    },
]

function seedDB() {
    //-- remove posts
    Post.deleteMany({}, function (err) {
        if (err) {
          console.log(err)  
        } else {
            //-- removed posts
            console.log('removed posts');
            //-- add posts            
            data.forEach(seed => {
                Post.create(seed, (err, savedData) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('added post');
                        //console.log(savedData);
                        //-- create a comment
                        Comment.create({
                            text: 'This  is awesome!',
                            author:'Homer'
                        },
                            function (err, comment) {
                                //console.log(comment);
                                if (err) {
                                    console.log(err)
                                } else {
                                    savedData.comments.push(comment);
                                    savedData.save();
                                    console.log('created new comment');  
                                }
                        })
                    }
                })
            })
        }
    })        
}




module.exports = seedDB;