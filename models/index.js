// Exporting an object containing all of our models
// this combines article.js schema with note.js schema

module.exports = {
    Article: require('./article.js'),
    Note: require('./note.js')
};
