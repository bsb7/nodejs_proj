const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');
    
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],

})

userSchema.plugin(passportLocalMongoose); //-- add methods to the  users

module.exports = mongoose.model('User', userSchema);