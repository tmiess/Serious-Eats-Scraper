// Exporting an object containing all of our models
// this combines article.js schema with note.js schema

module.exports = {
    Articles: require('./article.js'),
    Notes: require('./note.js')
};
