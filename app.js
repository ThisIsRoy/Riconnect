var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    middleware = require("./middleware"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds"),
    User = require("./models/user"),
    Comment = require("./models/comment"),
    College = require("./models/college");

app.use(express.static(__dirname + "/public"));    
app.use(express.static(__dirname + "/images"));    
//mongoose.connect("mongodb://localhost/colleges");
mongoose.connect("mongodb://roy:idkidk1@ds135594.mlab.com:35594/riconnect");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //use this to reset database of colleges 

//Passport Config
app.use(require("express-session")({
    secret: "What secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Allows logic based on whether user is logged in or not in res.locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Home Page
app.get("/", (req, res) => {
    res.render("index"); 
});

//Index Route
app.get("/colleges", (req, res) => {
    College.find({}).populate("comments").exec((err, allColleges) => {
        if(err) {
            console.log(err);
        } else {
            res.render("colleges", {colleges: allColleges, Comment: Comment});
        }
    }); 
});

//Show Route
app.get("/colleges/:id" , (req, res) => {
    College.findById(req.params.id).populate("comments").exec((err, foundCollege) => {
        if(err) {
            console.log(err);
            res.redirect("/colleges");
        } else {
            res.render("show", {college: foundCollege});
        }
    }); 
});

//Profile page
app.get("/profile/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err) {
            req.flash("error", "Profile not found");
            res.direct("/colleges");
        } else {
            res.render("profile", {user: foundUser});
        }
    });
});

//About page
app.get("/about", (req, res) =>{
    res.render("about");
});

//Comment New Route 
app.get("/colleges/:id/comments/new", middleware.isLoggedIn, (req, res) => {
    College.findById(req.params.id, (err, foundCollege) => {
        if(err) {
            console.log(err);
        } else {
            res.render("new", {college: foundCollege});
        }
    }); 
});

//Comment Post Route
app.post("/colleges/:id/comments", middleware.isLoggedIn, (req, res) => {
    College.findById(req.params.id, (err, foundCollege) => {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, newComment) => {
                if(err) {
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCollege.comments.push(newComment);
                    foundCollege.save();
                    res.redirect("/colleges/" + foundCollege._id);
                }
            });
        }
    });
});

//Comment edit route
app.get("/colleges/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {college_id: req.params.id, comment: foundComment});
        }
    });
});

app.put("/colleges/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/colleges/" + req.params.id);
        }
    }); 
});

//Comment Delete Route 
app.delete("/colleges/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/colleges/" + req.params.id);
        }
    });
});


//Sign up logic
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        residence: req.body.residence,
        email: req.body.email
    });
    User.register(newUser, req.body.password, (err, createdUser) => {
        if(err) {
            console.log(err);
            return res.render("register", {error: err.message});
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/colleges");
            });
        }
    });
});

//Login page
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/colleges",
        failureRedirect: "/login"
    }), (req, res) => {
});

//Logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/colleges");
});

app.listen(process.env.PORT, process.env.IP, () => console.log("SERVER STARTED!"));