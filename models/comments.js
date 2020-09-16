let mongoose = require('mongoose');


//-- setup schema
const commentSchema = mongoose.Schema({
    // _id:String,
    text: String,
    author:String,
    date: { 
        type: Date,
        default: Date.now()
    }
})

//-- save schema to a model
module.exports =  mongoose.model('Comment', commentSchema);