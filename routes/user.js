const express = require('express'),
    ObjectID = require('mongodb').ObjectID,
    User = require('../models/users'),
    router = express.Router();



//==============================
// USER ROUTE
//==============================
router.get('/posts/user/:userId', (req, res) => {
    //console.log(req.params.userId)
    User.findById(new ObjectID(req.params.userId)).populate('posts').exec(function (err, foundData) {
        if (err) {
            console.log(err);
        } else {
            res.render('user/show', { user: foundData });
            // console.log(foundData);
        }
    })

})

module.exports = router;