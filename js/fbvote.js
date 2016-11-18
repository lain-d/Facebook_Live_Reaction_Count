//values will include the pageID, postID, and if we want to do Insight Voting or not
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
        appId: '332002107168006',
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
        //Load the info on the post we want to pull information from and start polling for data
        $.getJSON("values.json?" + Math.random(), function(data) {
            currentValues = data;
            setTimeout(realTimeReactions, 5000);
            if (currentValues.includeShares === "true") {
                insightVoting();
                setInterval(insightVoting, 300000);
            }
        });
    });
}

//Helper Function To Count the Reactions in the Array
function voteArrayCounter(data) {
    $.each(data, function(i, v) {
        realtimer[v.type]++
    });
}

//Get the Reactions from Insights (this will include Shares). Insights only updates once every 5 Minutes or so.
function insightVoting() {
    insights = { "LIKE": 0, "LOVE": 0, "WOW": 0, "HAHA": 0, "SAD": 0, "ANGRY": 0 };
    FB.api(currentValues.pageID + '_' + currentValues.postID + '/insights/post_reactions_by_type_total', function(response) {
        insights.LIKE = response.data[0].values[0].value.like;
        insights.LOVE = response.data[0].values[0].value.love;
        insights.WOW = response.data[0].values[0].value.wow;
        insights.HAHA = response.data[0].values[0].value.haha;
        insights.SAD = response.data[0].values[0].value.sorry;
        insights.ANGRY = response.data[0].values[0].value.anger;
    });
}

// Get Reactions from the Reactions API, which is in real time, this only includes reactions on the 
// original post! Will apply votes once done, or page to the next array.
function realTimeReactions() {
    realtimer = { "LIKE": 0, "LOVE": 0, "WOW": 0, "HAHA": 0, "SAD": 0, "ANGRY": 0 };
    FB.api(currentValues.pageID + '_' + currentValues.postID + '/reactions?limit=1000', function(response) {
        voteArrayCounter(response.data);
        if (response.paging.next) {
            pageLoop(response.paging.next);
        } else {
            applyVotes();
        }

    });

}

//If there are multiple pages of real Time reaction results (aka if there are more than 1000), 
//this will loop through the rest of the results and then apply the votes when done.
function pageLoop(url) {
    $.getJSON(url, function(response) {
        voteArrayCounter(response.data);
        if (response.paging.next) {
            pageLoop(response.paging.next);
        } else {
            applyVotes();
        }
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
