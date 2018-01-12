// // Grab the articles as a json
// $.getJSON("/articles", function(data) {
//     // For each one
//     //<a href="http://your_url_here.html">Link</a>
//     for (var i = 0; i < data.length; i++) {
//         // Display the apropos information on the page
//         $("#articles").append("<p data-id='" + data[i]._id + "'><strong>" + data[i].title + "</strong><br />" + "<a target='_blank' href=" + data[i].link + ">Get the recipe here</a>" + "<br />" + data[i].summary + "</p>" + "<button data-id='" + data[i]._id + "' id='saveArticle'>Save Article</button>");
//     }
// });

$(document).ready(function() {

    // when the user clicks the savearticle button
    $(".saveArticle").on("click", function() {
        $(this).text("Saved");
        var thisId = $(this).attr("data-id");
        console.log(thisId);
        $.ajax({
                method: "POST",
                url: "/savedArticles/" + thisId
            })
            .done(function(data) {
                console.log(data);
            });
    });

    // Whenever someone clicks on note button
    $(".makeNote").on("click", function() {
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the button
        var thisId = $(this).attr("data-id");
        console.log(thisId);

        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/articles/" + thisId
            })
            // With that done, add the note information to the page
            .done(function(data) {
                console.log(data);
                // The title of the article
                $("#notes").append("<h2>" + data.title + "</h2>");
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >" + '<br />');
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>" + '<br />');
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    });

    // When you click the savenote button
    $(".savenote").on("click", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
        console.log(thisId);
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/savedArticles/" + thisId,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val(),
                }
            })
            // With that done
            .done(function(data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });

});






// // when the user clicks the deletearticle button
// $(document).on("click", "#deleteArticle", function() {
//     var thisId = $(this).attr("data-id");
//     $.ajax({
//             method: "POST",
//             url: "/deleted ",
//             data: {
//                 title: this.title,
//                 link: this.link,
//             }
//         })
//         .done(function(data) {
//             console.log(data);
//         });
// });

// // when the user clicks the "view saved articles button"
// $(document).on("click", "#viewSavedArticles", function() {
//     console.log("viewSavedArticles button works");

// });
