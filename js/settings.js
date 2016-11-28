  $("#savebutt").click(function(){
    var data = {"pageID": $("#pageIDval").val(), "postID": $("#postIDval").val(), "includeShares": $("#sharecheck")[0].checked};

    $.post("saveit.php", data, function(d) {
    $("#sm").text("Saved!").show().fadeOut(1000);
   });
  });   

$( document ).ready(function() {
   $.getJSON( "./values.json", function( data ) {
    $("#pageIDval").val(data.pageID);
    $("#postIDval").val(data.postID);
    if(data.includeShares === "true")
    {
      $( "#sharecheck" ).prop( "checked", true );
    }
    $(".container").fadeIn(100);

});
});
