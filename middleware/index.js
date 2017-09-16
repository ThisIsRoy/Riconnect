var Comment = require("../models/comment");
var College = require("../models/college");

//All middleware 
var middlewareObject = {};

middlewareObject.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                req.flash("error", "Error in accessing comment");
                res.redirect("back");
            } else {
                //check if user wrote comment          
                if(foundComment.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    req.flash("error", "You don't have permission");
                    res.redirect("back");
                }
                
            }
        });
    } else {
        req.flash("error", "Please log in first");
        res.redirect("back");
    }
};

middlewareObject.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first");
    res.redirect("/login");
};

module.exports = middlewareObject;