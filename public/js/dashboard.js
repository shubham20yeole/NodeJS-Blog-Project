$(document).ready(function(){
	$(".likeUser").on('click', likeUser);
  $(".dislikeUser").on('click', dislikeUser);
})

function likeUser(){
  var tagId = $(this).data('id');
    var parameters = { search: $(this).data('id') };

          $.get( '/users/like/'+$(this).data('id'),parameters, function(data2) {
            $("#like-"+tagId).text(data2);

      }); 
}

function dislikeUser(){
  var tagId = $(this).data('id');
    var parameters = { search: $(this).data('id') };

          $.get( '/users/dislike/'+$(this).data('id'),parameters, function(data2) {
            $("#dislike-"+tagId).text(data2);

      }); 
}

$(document).on("keyup","#searchinp",function() { 
      var id = $(this).val();
    $('input').val(id);
  });
