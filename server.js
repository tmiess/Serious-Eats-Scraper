var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var request = require("request");
var cheerio = require("cheerio");
// tried axios at first but then realized that I needed request
// var axios = require("axios");

// Require all models
var db = require("./models/index.js");


//////////testing mongodb and scraper function//////////////////
////////////////////////////////////////////////////////////////

// Database configuration
// var databaseUrl = "seriousEatsdb";
// var collections = ["sandwiches"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//     console.log("Database Error:", error);
// });

////////////////////////////////////////////////////////////////
///////////////////////end testing//////////////////////////////


var port = process.env.PORT || 8080;

// Initialize Express
var app = express();

// connect to handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

////// most of this will follow the exercise 20 template the mongo-mongoose folder

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// Also make sure that Heroku can access our database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/seriousEatsdb";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {});

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// Routes --> eventually put these into a controller folder under routes.js and require it in this file. for now, just make sure they are working

/////////////test route//////////////////
app.get("/test", function(req, res) {
    res.send("Testing area");
});
/////////////////////////////////////////

//////////wipe db route//////////////////
app.get("/clear", function(req, res) {
    db.Articles
        .remove({}).then(function(content) {
            let clearedObject = {
                article: content
            };
            // If we were able to successfully find Articles, send them back to the client
            res.render("cleared", clearedObject);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
/////////////////////////////////////////

// get route to scrape data from seriouseats.com and store it in db
app.get("/", function(req, res) {
    db.Articles
        .find({ "saved": false })
        .populate("note")
        .then(function(content) {
            let scrapedObject = {
                article: content
            };
            // If we were able to successfully find Articles, send them back to the client
            res.render("index", scrapedObject);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/scrape", function(req, res) {
    request("http://www.seriouseats.com/sandwiches", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // look for all "a" tags with class "module__link"
        $("a.module__link").each(function(i, element) {

            //classes are "title" and "kicker", both are children of "a.module_link"

            var link = $(element).attr("href");
            var title = $(element).children('.title').text();
            var summary = $(element).children('.kicker').text();

            if (title && link && summary) {
                //save each one to mongoDB
                db.Articles.create({
                        link: link,
                        title: title,
                        summary: summary,
                    },
                    function(err, inserted) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(inserted);
                            console.log("succesfully added");
                        }
                    });
            }
        });
    });
    res.redirect("/");
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Articles
        .find({})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
            console.log("articles have been found!");
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            console.log("articles have not been found!");
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Articles
        .findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Notes
        .create(req.body)
        .then(function(dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Articles.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for displaying saved articles
// "saved": true is what we want to find in db.Articles
app.get("/savedArticles", function(req, res) {
    // Grab every document in the Articles collection
    db.Articles
        .find({ saved: true })
        .populate("note")
        .then(function(content) {
            let savedArticles = {
                article: content
            };
            res.render("saved", savedArticles);
            console.log("displaying saved articles");
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            console.log("cannot display saved articles");
            res.json(err);
        });
});

app.post("/savedArticles/:id", function(req, res) {
    var thisID = req.params.id;
    db.Articles
        .findOneAndUpdate({ _id: thisID }, { saved: true })
        .then(function(savedArticle) {
            // If the User was updated successfully, send it back to the client
            console.log("article saved");
        })
        .catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

app.post("/deletedArticles/:id", function(req, res) {
    var thisID = req.params.id;
    db.Articles
        .remove({ _id: thisID })
        .then(function() {
            // If the User was updated successfully, send it back to the client
            console.log("article deleted");
        })
        .catch(function(err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});
// app.get("/deletedArticles", function(req, res) {});

// saves notes and changes "saved" to true on article object
// app.post("/savedArticles", function(req, res) {
//     db.Note
//         .create(req.body)
//         .then(function(dbNote) {
//             // If a Note was created successfully, find one Article (there's only one) and push the new Note's _id to the User's `notes` array
//             // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//             // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//             return db.Articles.findOneAndUpdate({}, { savedArticle: true }, { $push: { notes: dbNote._id } }, { new: true });
//         })
//         .then(function(saveArticle) {
//             // If the User was updated successfully, send it back to the client
//             res.json(saveArticle);
//         })
//         .catch(function(err) {
//             // If an error occurs, send it back to the client
//             res.json(err);
//         });
// });

app.listen(port, function() {
    console.log("connected to port " + port);
});
