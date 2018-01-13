$(document).ready(function() {

    // when the user clicks the savearticle button
    $(".saveArticle").on("click", function() {
        console.log("saveArticle button works");
        $(this).remove();
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

    // when the user clicks the deleteArticle button
    $(".deleteArticle").on("click", function() {
        console.log("deleteArticle button works");
        $(this).parent("#container").remove();
        var thisId = $(this).attr("data-id");
        console.log(thisId);
        $.ajax({
                method: "POST",
                url: "/deletedArticles/" + thisId
            })
            .done(function(data) {
                console.log(data);
            });
    });

    // when the user clicks the makeNote button
    $(".makeNote").on("click", function() {
        console.log("makeNote button works");
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
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>" + '<br />');
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button class='saveNote' data-id='" + data._id + "'>Save Note</button>");
            });
    });
});

// have to use this format since these buttons are created dynamically
$('body').on('click', 'button.saveNote', function() {
    console.log("savenote button works");
    $(".saveNote").text("Saved");
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
