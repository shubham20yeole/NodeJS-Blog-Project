$(document).on("click","#submitEmail",function() { 
alert();
var d = new Date();
var dateAndTime = "Date: "+d.getMonth()+"/"+d.getDate()+"/"+d.getFullYear()+", Time: "+d.getHours()+":"+d.getMinutes();
var email = $("#email").val();
var message = $("#emailmessage").val();
var long = $("#long").val();
var lat = $("#lat").val();
var date = dateAndTime;
$.post( "/send/", { email: email, message: message, long: long, lat: lat, date: date})
  .done(function( data ) {
    $( "#returnmessage" ).append('<div id="commenterdiv"><p id="commentername">'+email+'<span id="timespan">'+date+'</span></p><p id="commentptag">'+message+'</p></div><br>').addClass("animated slideInDown");
  });
});