$(document).ready(function(){

})
$(document).on("click",".w3-padding-16",function() { 
	  	var id = $(this).attr('id');
	 	alert(id);
	 	window.location = "http://localhost:3000/dashboard/"+id;
});