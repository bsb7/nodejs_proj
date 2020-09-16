let mongoose = require('mongoose');


//-- setup schema
const postsSchema = new mongoose.Schema({
    // _id:String,
    title: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ] ,
    date: {
        type: Date,
        default: Date.now()
    }
})

//-- save schema to a model
module.exports = new mongoose.model('Post', postsSchema);