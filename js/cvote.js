//Sorry this code has gotten a little sloppy!!
//New vote bubbles aren't working again, need to re-write the code to get the location of the DIV of the new vote value and spawn the
//bubble there...right now it's all hard coded (see lines 239-241)
//Vs Bar is turned off. Should convert this into objects to take care of this, I know it looks like qBasic right now.

var appID = "410111042683836";
//values will include the pageID, postID
var currentValues = { "pageID": "", "postID": "" };
var lastnew = 0;
var bigdate = 0;
//our real time and insight reaction data objects
var realtimer = { "#teamaja": 0, "#teamsasha": 0, "#teamalexis": 0, "#teamshea": 0, "#teamfarrah": 0, "#teamtrinity": 0, "#teamnina": 0, "#teamvalentina": 0, "#teampeppermint": 0};
var oldvotes = realtimer;
var oldloves = 0;
var oldlikes = 0;
var timemer = 180000000000;
var commentcount = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
String.prototype.toHHMMSS = function() {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}
$("#countdown").text(timemer.toString().toHHMMSS());
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
        console.log("checking me");
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
    FB.api(currentValues.pageID + '_' + currentValues.postID + '/reactions?limit=500&order=reverse_chronological', function(response) {
        if (response.error) {
            console.log("error loading post");
            console.log("no load");
            $("#voteSettings").show();
            $("#sm").text("invalid Post ID").show().fadeOut(5000);

        } else {
            thecountdown();
            realTimeReactions();
        }
    });
}

// Get Reactions from the Reactions API, which is in real time, this only includes reactions on the
// original post! Will apply votes once done, or page to the next array. See Development Branch to get Reaction Votes!

function realTimeReactions() {
    //   $.each(realtimer, function(i, v){realtimer[i]=0});
    FB.api(currentValues.pageID + '_' + currentValues.postID + '/comments?limit=500&order=reverse_chronological', function(response) {
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
    var allvotes = false;
    console.log("DEBUG NESSAGE: GETTING COMMENTS AND SORTING");
    $.each(data, function(i, v) {
        var timestamp = new Date(v.created_time).getTime();
        //console.log("the ID is " + theid[1] +"the last new ID is " + lastnew);

        if (timestamp <= lastnew) {
            console.log("last new comment applying " + v.from.name);
            allvotes = true;
            return false;
        } else if (timestamp > bigdate) {
            console.log("got latest post ID is " + timestamp + " " + v.from.name);
            bigdate = timestamp;
        }
        commentcount++;
        $.each(realtimer, function(a, b) {

            if (v.message.toLowerCase().includes(a)) {

                realtimer[a]++;

            }


        });

        //   realtimer[v.type]++;
        //  if (realtimer[v.type] > oldvotes[v.type] && $("#" + (v.type).toLowerCase()).is(':visible')) {
        //    setTimeout(function() { animatevote(v.type); }, getRandomInt(50, 2500));
        // }

    });
    if (next && allvotes !== true) {
        console.log("paging");
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
    console.log("DEBUG NESSAGE: GETTING NEXT SET OF COMMENTS");
    $.getJSON(url, function(response) {
        voteArrayCounter(response.data, response.paging.next);
    });
}
//This will apply the vote values to the display. If you aren't counting a reaction,
//make it invisible with CSS DON'T DELETE THE DIV
function applyVotes() {
	lastnew = bigdate;
    console.log("DEBUG NESSAGE: FINISHED COUNTING " + commentcount + " COMMENTS");
    commentcount = 0;
    oldvotes = realtimer;
    var pointer = 0;
    $.each(realtimer, function(k, v) {
        //   console.log("adding for " + k +" the value is " + v + "applying to #choice" + pointer);
        $("#choice" + pointer).text(v);
        pointer++;
    });

    // if ($(".tugofwarbar").is(':visible')) {
    // tugofwar(parseInt($("#choice0").text()), parseInt($("#choice1").text()));
    // }
    console.log("Test Ended");
    setTimeout(realTimeReactions, 2000);
}


//Tug of War Function
function tugofwar(sideb, sidea) {
    var total = sidea + sideb;
    $("#sideb").animate({ width: (sidea / total) * 100 + "%" }, { duration: 500, queue: false });
    $("#sidea").animate({ width: (sideb / total) * 100 + "%" }, { duration: 500, queue: false });
    $("#sideb").text(Math.ceil((sidea / total) * 100) + "%");
    $("#sidea").text(Math.ceil((sideb / total) * 100) + "%");
}

//This will animate a little duder whenever a vote is counted (optional)
function animatevote(type) {
    type = type.toLowerCase();
    var times = Math.random() * 1000 + 500;
    var dodo = "div" + Math.floor(Math.random() * 100000);
    $(".screen").append("<div class='particle' id='" + dodo + "'><img src='images/bubbles/" + type + ".png'></div>");
    $("#" + dodo).css({ "top": $("#" + type).css("top"), "left": getRandomInt(parseInt($("#" + type).css("left")), parseInt($("#" + type).css("left")) + parseInt($("#" + type).css("width"))) + "px" });
    $("#" + dodo).animate({ top: parseInt($("#" + type).css("top")) - 200 - (Math.random() * 200) }, { duration: times, queue: false });
    setTimeout(function() { $("#" + dodo).animate({ opacity: 0 }, { duration: 200, queue: false, complete: function() { $("#" + dodo).remove(); } }); }, times - 200);
}

function thecountdown() {
    timemer--;
    $("#countdown").text("Time Left to vote: " + timemer.toString().toHHMMSS());
    if (timemer === 0) {
        //      if (realtimer.burgers > realtimer.pizza) {
        //        $("#winnera").fadeIn();
        //  } else {
        //    $("#winnerb").fadeIn();
        // }
        console.log("done");
    } else {
        setTimeout(thecountdown, 1000);
    }
}
