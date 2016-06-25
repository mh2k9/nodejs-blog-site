/**
 * @Author: Mehedi Hasan
 * @E-mail: mhm2k9@gmail.com
 * Script: stories.js
 */

"use strict";

/**
 * Module dependencies.
 */
var express = require('express'),
    helpers = require('express-helpers'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require("express-session"),
    mongodb = require('mongodb'),
    db = require('./model/db'),
    User = require('./model/users'),
    Story = require('./model/stories'),
    Comment = require('./model/comment'),
    Generic = require("./components/Generic"),
    multer  = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, next) {
            next(null, './public/uploaded')
        },
        filename: function (req, file, next) {
            next(null, 'avatar-' + Date.now() + ".jpg")
        }
    }),
    upload = multer({ storage: storage }),
    fUpload = upload.fields([{name: 'story_image', maxCount: 1}]),
    conf_session = session({
        genid: function () {
            return Generic.genUuid();
        },
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }),
    app = express();


////////////////////////////////////////////////
//                                            //
//              Set app config                //
//                                            //
////////////////////////////////////////////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
helpers(app);


////////////////////////////////////////////////
//                                            //
//                 Used config                //
//                                            //
////////////////////////////////////////////////
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(conf_session);


////////////////////////////////////////////////
//                                            //
//       Home page routing with stories       //
//                                            //
////////////////////////////////////////////////

app.get("/", function (req, res, next) {
    Story.find({}, null, { sort:{created: -1} }, function (err, stories) {
        if (err) {
            return next(err);
        } else {
            var username = req.session.user_name || null;
            res.render("index.ejs", {user: username, stories: stories});
        }
    });
});


////////////////////////////////////////////////
//                                            //
//           Get Registration page            //
//                                            //
////////////////////////////////////////////////

app.get('/login', function (req, res) {
    res.render("authenticate.ejs");
});


////////////////////////////////////////////////
//                                            //
//           Get Registration page            //
//                                            //
////////////////////////////////////////////////

app.get('/logout', function (req, res) {
    req.session.user_name = null;
    req.session.requested_url = "/";
    res.redirect('/');
});


////////////////////////////////////////////////
//                                            //
//           Get Registration page            //
//                                            //
////////////////////////////////////////////////

app.get('/new-story', function (req, res) {
    req.session.requested_url = "/new-story";
    var username = req.session.user_name || null;
    res.render("create-story.ejs", {user: username});
});


////////////////////////////////////////////////
//                                            //
//                    Login                   //
//                                            //
////////////////////////////////////////////////

app.post('/login', function (req, res) {
    var password = req.body.password,
        username = req.body.username,
        requested_url = req.session.requested_url || null,
        page = "/";

    // save user to database
    User.getAuthenticated(username, password, function (err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log(user);
            req.session.user_name = username;
            req.session.user_email = user.email;
            if(requested_url !== null){
                page = requested_url;
            }
            //console.log(req.session.user_email);
            res.redirect(page);
        } else { // otherwise we candetermine why we failed
            var reasons = User.failedLogin;
            switch (reason) {
                case reasons.NOT_FOUND:
                    console.log("404 not found!");
                    break;
                case reasons.PASSWORD_INCORRECT:
                    console.log("Incorrect password!");
                    break;
                case reasons.MAX_ATTEMPTS:
                    console.log("You are temporarily blocked. Try after 2 hours!");
                    break;
            }

            res.render("authenticate.ejs");
        }
    });
});


////////////////////////////////////////////////
//                                            //
//             Register new user              //
//                                            //
////////////////////////////////////////////////

app.post('/register', function (req, res) {
    var password = req.body.password,
        username = req.body.username,
        newUser = new User({
            username: username,
            password: password,
            email: req.body.email,
            about_user: req.body.about_yourself
        });

    // save user to database
    newUser.save(function (err) {
        if (err) throw err;

        console.log("Successfully added!");
        res.render("authenticate.ejs", {user: username});
    });
});


////////////////////////////////////////////////
//                                            //
//          User comments for story           //
//                                            //
////////////////////////////////////////////////

app.post('/comment', function (req, res) {
    var comment = req.body.comment,
        storyTitle = req.body.story_title,
        user = req.session.user_name || null,
        email = req.session.user_email || null,
        newComment = new Comment({
            story_title: storyTitle,
            username: user,
            email: email,
            comment: comment
        }),
        redirect_url = "/detail/" + storyTitle;
    //console.log(user + "-" + email);
    if(user === null || email === null){
        req.session.requested_url = redirect_url;
        res.redirect("/login");
    }else{
        // save user to database
        newComment.save(function (err) {
            if (err) throw err;

            res.redirect(redirect_url);
        });
    }
});

////////////////////////////////////////////////
//                                            //
//              Create story                  //
//                                            //
////////////////////////////////////////////////

app.post("/new-story", fUpload, function (req, res) {
    var file_name = req.files.story_image[0].filename,
        title = req.body.story_title,
        story = req.body.story,
        author = req.session.user_name,
        newStory = new Story({
            title: title,
            story: story,
            author: author,
            image: "/uploaded/" + file_name
        });

    // Upload File
    fUpload(req, res, function (err) {
        if (err) {
            console.log("An error occurred when uploading");
        }else{
            newStory.save(function (err) {
                if(err){
                    throw err;
                }else{
                    Story.find({}, function (err, stories) {
                        if (err) {
                            return console.error(err);
                        } else {
                            console.log(stories);
                            res.render("index.ejs");
                        }
                    });
                }
            });
        }
    });
});

////////////////////////////////////////////////
//                                            //
//              Delete story                  //
//                                            //
////////////////////////////////////////////////

app.get("/delete-story", function (req, res) {
    var id = req.query.id,
        author = req.session.user_name;
    Story.find({ _id:new mongodb.ObjectID(id), author: author }).remove(function(err){
        if(err){
            throw err;
        }

        res.redirect("/");
    });
});


////////////////////////////////////////////////
//                                            //
//              Single story                  //
//                                            //
////////////////////////////////////////////////

app.get("/detail/:title", function (req, res) {
    var title = req.params.title,
        author = req.session.user_name || null;

    //Get story from DB
    Story.find({ title: title }, function(err, story){
        if(err){
            throw err;
        }
        story = (typeof story[0] != "undefined") ? story[0] : {};
        //res.send(story);

        //Get comments
        Comment.find({ story_title: title }, function(err, comments){
            if(err){
                throw err;
            }
            //res.send(comments);
            console.log(comments);
            res.render("single.ejs", {story: story, user: author, comments: comments});
        });
    });
});

////////////////////////////////////////////////
//                                            //
//              Error handler                 //
//                                            //
////////////////////////////////////////////////

function errorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', { error: err });
}

function notFound(req, res, next){
    res.status(404);
    res.render('error', { error: "error" });
}

app.use(errorHandler);
app.use(notFound);

module.exports = app;
