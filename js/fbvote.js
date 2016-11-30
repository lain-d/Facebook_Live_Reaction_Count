//values will include the pageID, postID
var currentValues;
//our real time and insight reaction data objects
var realtimer = { "LIKE": 0, "LOVE": 0, "WOW": 0, "HAHA": 0, "SAD": 0, "ANGRY": 0 };
var insights = { "LIKE": 0, "LOVE": 0, "WOW": 0, "HAHA": 0, "SAD": 0, "ANGRY": 0 };
//This Script will log the User in to Facebook.
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
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
        appId: '372358933100350',
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
    console.log('Connected to Facebook Loading App...');
    //Check to make sure the person gave credentials.
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
        //check if we can get the userToken to work
        $("#logInStuff").fadeOut(200);
        $("#voteSettings").fadeIn(250);
    });
}

//Saves the post settings and starts up the live vote monitoring. 
$("#savebutt").click(function() {
    currentValues.pageID = $("#pageIDval").val();
    currentValues.postID = $("#postIDval").val();
    FB.api(currentValues.pageID + '_' + currentValues.postID + '/reactions?limit=1000', function(response) {
        if (response.error) {
            console.log("error loading post");
            console.log("no lload");
            $("#sm").text("invalid Post/Page ID").show().fadeOut(2000);

        } else {

            $("#voteSettings").fadeOut(10);
            realTimeReactions();
        }
    })
});


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
        realtimer[v.type]++
    });
    if (next) {
        pageLoop(next);
    } else {
        applyVotes();
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
    $("#liken").text(realtimer.LIKE + Math.max(0, (insights.LIKE - realtimer.LIKE)));
    $("#loven").text(realtimer.LOVE + Math.max(0, (insights.LOVE - realtimer.LOVE)));
    $("#hahan").text(realtimer.HAHA + Math.max(0, (insights.HAHA - realtimer.HAHA)));
    $("#wown").text(realtimer.WOW + Math.max(0, (insights.WOW - realtimer.WOW)));
    $("#sadn").text(realtimer.SAD + Math.max(0, (insights.SAD - realtimer.SAD)));
    $("#angryn").text(realtimer.ANGRY + Math.max(0, (insights.ANGRY - realtimer.ANGRY)));
    setTimeout(realTimeReactions, 5000);
}
