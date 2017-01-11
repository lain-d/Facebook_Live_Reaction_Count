var appID = "372358933100350";
//values will include the pageID, postID
var currentValues = { "pageID": "", "postID": "" };
//our real time and insight reaction data objects
var realtimer = { "LIKE": 0, "LOVE": 0, "WOW": 0, "HAHA": 0, "SAD": 0, "ANGRY": 0 };
var insights = { "LIKE": 0, "LOVE": 0, "WOW": 0, "HAHA": 0, "SAD": 0, "ANGRY": 0 };
var oldloves = 0;
var oldlikes = 0;
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
        return false; //<---- Add this line
    }
});

//Saves the post settings and runs callback to start up the live vote monitoring. 
$("#savebutt").click(function() {
    currentValues.pageID = $("#pageIDval").val();
    currentValues.postID = $("#postIDval").val();
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
            console.log("no load");
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
    realtimer = { "LIKE": 0, "LOVE": 0, "WOW": 0, "HAHA": 0, "SAD": 0, "ANGRY": 0 };
    FB.api(currentValues.pageID + '_' + currentValues.postID + '/reactions?limit=1000', function(response) {
        if (response.error) {
            console.log("error loading post");
            $("#voteSettings").fadeIn(250);
            $("#sm").text("Error Loading Post").show().fadeOut(3000);
        } else {
            if (response.data.length < 1) {
                // will only check reactions once there are some.
                setTimeout(realTimeReactions, 5000);
                return;
            }
            voteArrayCounter(response.data, response.paging.next);
        }
    });

}

//Function To Count the Reactions returned from  Facebook, includes callback to get next set of data or display results.
function voteArrayCounter(data, next) {
    $.each(data, function(i, v) {
        realtimer[v.type]++;
        if(v.type == "LIKE" && realtimer["LIKE"] > oldlikes)
        {
            setTimeout(function(){animatevote("like", 25, 600);}, getRandomInt(50, 2500));
        }
        if(v.type == "LOVE" && realtimer["LOVE"] > oldloves)
        {
             setTimeout(function(){animatevote("love", 700, 1209);}, getRandomInt(50, 2500));
        }
    });
    if (next) {
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
    oldlikes = realtimer.LIKE;
    oldloves = realtimer.LOVE;
    $("#liken").text(realtimer.LIKE);
    $("#loven").text(realtimer.LOVE);
    $("#hahan").text(realtimer.HAHA);
    $("#wown").text(realtimer.WOW);
    $("#sadn").text(realtimer.SAD);
    $("#angryn").text(realtimer.ANGRY);
    setTimeout(realTimeReactions, 5000);
}

//This will animate a little duder whenever a vote is counted (optional)
function animatevote(type, place1, place2)
{
    var times =  Math.random()*1000+500;
    var dodo = "div"+Math.floor(Math.random()*100000);
    $(".screen").append("<div class='particle' id='"+dodo+"'><img src='images/"+type+"p.png'></div>");
    $("#"+dodo).css({"top":"600px", "left":getRandomInt(place1, place2)+"px"});
    $("#"+dodo).animate({ top: 420-Math.random()*200}, { duration: times, queue: false });
    setTimeout(function(){$("#"+dodo).animate({ opacity: 0},  { duration: 200, queue: false, complete: function(){$("#"+dodo).remove();} });},times-200);
}
