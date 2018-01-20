$(document).ready(function() {
    $(".makeNote").click(function() {
        $(".modal").addClass("is-active");
    });

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
        $(this).closest("#container").remove();
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
        $(".modal-card-foot").empty();
        $(".modal-card-body").empty();
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
                $(".modal-card-title").text(data.title);
                // A textarea to add a new note body
                $(".modal-card-body").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $(".modal-card-foot").append("<a class='button is-medium is-info saveNote' data-id='" + data._id + "'>Save Note</a>");
                $(".modal-card-foot").append("<a class='button is-medium is-info close' data-id='" + data._id + "'>Cancel</a>");
            });
    });
});

// have to use this format since these buttons are created dynamically
$('body').on('click', '.saveNote', function() {
    console.log("savenote button works");
    $(".saveNote").text("Saved");
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    console.log("note: " + $("#bodyinput").val());
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/savedArticles/" + thisId,
            data: {
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
    $(".saveNote").text("Save New Note");
});

$('body').on("click", ".close", function() {
    console.log("modal-close button works");
    $(".modal").removeClass("is-active");
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("burger js connected");
    // Get all "navbar-burger" elements
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(function($el) {
            $el.addEventListener('click', function() {

                // Get the target from the "data-target" attribute
                var target = $el.dataset.target;
                var $target = document.getElementById(target);

                // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                $el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }
});
