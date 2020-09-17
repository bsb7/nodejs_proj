let mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
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