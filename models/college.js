var mongoose = require("mongoose");

var collegeSchema = new mongoose.Schema({
    name: String,
    image: String,
    crestImage: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("College", collegeSchema);