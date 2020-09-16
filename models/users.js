const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password:String
})

userSchema.plugin(passportLocalMongoose); //-- add methods to the  users

module.exports = mongoose.model('User', userSchema);