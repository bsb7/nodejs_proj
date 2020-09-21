let mongoose = require('mongoose');


//-- setup schema
const commentSchema = mongoose.Schema({
    // _id:String,
    text: String,
    date: {
        type: Date,
        default: Date.now()
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})

//-- save schema to a model
module.exports = mongoose.model('Comment', commentSchema);