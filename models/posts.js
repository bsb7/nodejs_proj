let mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Post', postsSchema);