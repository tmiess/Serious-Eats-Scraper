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

// // Database configuration
// var databaseUrl = "seriousEatsdb";
// var collections = ["sandwiches"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//     console.log("Database Error:", error);
// });

///////////////////////end testing//////////////////////////////
////////////////////////////////////////////////////////////////



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

// Routes --> eventually put these into a controller folder under routes.js and require it in this file. for now, just make sure they are working

/////////////test route//////////////////
app.get("/test", function(req, res) {
    res.send("Hello world");
});
/////////////////////////////////////////

// get route to scrape data from seriouseats.com and store it in db

app.get("/scrape", function(req, res) {
    request("http://www.seriouseats.com/sandwiches", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // look for all "a" tags with class "module__link"
        $("a.module__link").each(function(i, element) {

            //classes are title and kicker, both are children of a.module_link

            var link = $(element).attr("href");
            var title = $(element).children('.title').text();
            var summary = $(element).children('.kicker').text();

            if (title && link && summary) {
                //save each one to mongoDB
                db.Article.create({
                        link: link,
                        title: title,
                        summary: summary
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
    db.Article
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

app.listen(port, function() {
    console.log("connected to port " + port);
});
