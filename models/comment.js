var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    title: String,
    date: String,
    type: String,
    description: String,
    author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);