const Post = require('../models/posts'),
    Comment = require('../models/comments');


let middleware = {};

middleware.checkOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id, (err, foundPost) => {
            if (err) {
                res.redirect('/back');
            } else {
                //- does user own post
                if (foundPost.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back')
                }
            }
        })
    } else {
        res.redirect('back');
    }
}

middleware.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('/back');
            } else {
                //- does user own post
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back')
                }
            }
        })
    } else {
        res.redirect('back');
    }
}

middleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}









module.exports = middleware