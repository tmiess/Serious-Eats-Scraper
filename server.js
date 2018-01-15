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

var routes = require("./controllers/controller.js");
app.use("/", routes);

app.listen(port, function() {
    console.log("connected to port " + port);
});
