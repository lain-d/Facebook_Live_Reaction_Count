var appID = "1780509962264342";
//values will include the pageID, postID
var currentValues = { "pageID": "", "postID": "" };
//our real time and insight reaction data objects
var unlocksNeeded = 5;
var reactCount = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//This Script will log the User in to Facebook.
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        startApp();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
    }
}
// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}
window.fbAsyncInit = function() {
    FB.init({
        //set your app ID here
        appId: appID,
        cookie: true, // enable cookies to allow the server to access 
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v2.8' // use graph api version 2.8
    });

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

// Load the SDK asynchronously
(function(d, s, id) {

    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//Once Logged in Start up The Voting App
function startApp() {

    //Check to make sure the person gave credentials.
    FB.api('/me', function(response) {
        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
        //check if we can get the userToken to work
        $("#logInStuff").fadeOut(200);
        $("#voteSettings").fadeIn(250);
    });
}

$('#postIDval').keypress(function(e) {
    if (e.which == 13) {
        e.preventDefault();
        event.preventDefault;
        $("#savebutt").click();
        return false;
    }
});

//Saves the post settings and runs callback to start up the live vote monitoring. 
$("#savebutt").click(function() {
    currentValues.pageID = $("#pageIDval").val();
    currentValues.postID = $("#postIDval").val();
    unlocksNeeded = $("#reactval").val();
    $(".countText").text(reactCount + " OF " + unlocksNeeded);
    if (isNaN(currentValues.pageID)) {
        FB.api(currentValues.pageID, function(response) {
            if (response.error) {
                $("#sm").text("Invalid Page Name").show().fadeOut(2000);
                return;
            } else {
                currentValues.pageID = response.id;
                $("#voteSettings").fadeOut(10);
                setTimeout(validatePost, 20000);
            }

        });
    } else {
        $("#voteSettings").fadeOut(10);
        setTimeout(validatePost, 20000);
    }

});

//callback function to validate the post and 
function validatePost() {
    FB.api(currentValues.pageID + '_' + currentValues.postID + '/reactions?limit=1000', function(response) {
        if (response.error) {
            console.log("error loading post");
            $("#voteSettings").show();
            $("#sm").text("invalid Post ID").show().fadeOut(5000);

        } else {
            realTimeReactions();
        }
    });
}

// Get Reactions from the Reactions API, which is in real time, this only includes reactions on the 
// original post! Will apply votes once done, or page to the next array. See Development Branch to get Reaction Votes!

function realTimeReactions() {
    FB.api(currentValues.pageID + '_' + currentValues.postID + '/reactions?limit=1000', function(response) {
        if (response.error) {
            console.log("error loading post");
            $("#voteSettings").fadeIn(250);
            $("#sm").text("Error Loading Post").show().fadeOut(3000);
        } else {
            if (response.data.length < 1) {
                // will only check reactions once there are some.
                setTimeout(realTimeReactions, 2500);
                return;
            }

            voteArrayCounter(response.data, response.paging.next);
        }
    });

}

//Function To Count the Reactions returned from  Facebook, includes callback to get next set of data or display results.
function voteArrayCounter(data, next) {
    $.each(data, function(i, v) {
        reactCount++;

    });
    if (next && reactCount < unlocksNeeded) {
        pageLoop(next);
        return "loop";
    } else {

        applyVotes();
        return "applied";
    }
}

//If there are multiple pages of real Time reaction results (aka if there are more than 1000), 
//this will get the next set of results.
function pageLoop(url) {
    $.getJSON(url, function(response) {
        voteArrayCounter(response.data, response.paging.next);
    });
}
//This will apply the vote values to the display. If you aren't counting a reaction,
//make it invisible with CSS DON'T DELETE THE DIV
function applyVotes() {
    var unlockVotes = unlocksNeeded - reactCount;
    if (unlockVotes <= 0) {
        unlockVotes = 0;
        $(".barfill").css('width', "100%");
        $(".countText").text("UNLOCKED!!!!!!");
    } else {
        var opa = parseInt((reactCount / unlocksNeeded) * 100);
        $(".barfill").animate({
                'width': opa + "%",
            },
            800,
            function() {
                /* stuff to do after animation is complete */
            });
        $(".countText").text(reactCount + " OF " + unlocksNeeded);
        reactCount = 0;
        setTimeout(realTimeReactions, 2000);
    }

}
