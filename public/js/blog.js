$(document).ready(function() {

    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    
    var x = 1, count=1; //initlal text box count
    initGeolocation();
    $(document).on("click","#submit",function() { 
     var finalText = $("#final").text();
        for(i=0;i<count; i++){

          var temp = '<p id="contenttext">'+$("#p-id-"+i).text()+'</p>' + '<br><br><pre><code class="javascript">'+$("#code-id-"+i).text()+'</code></pre><br><br>';

          finalText = finalText + temp;


        }
        $("#final").text(finalText);
        var myString = finalText;

        var sampleText =  $("#final").html(myString).text();


        $("#sample").append(sampleText);
        $("#blogdata").val(sampleText);
$("#saveblog").delay(1000).click();

    });
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed 
            x++;  //text box increment
            $(wrapper).append('<div><textarea rows="3" cols="44" id="cont'+count+'" placeholder="Section Description" class="cont"></textarea><textarea rows="3" cols="44" id="code'+count+'" placeholder="Section Code" class="code" ></textarea><a href="#" class="remove_field" id='+count+'>Remove</a></div>'); //add input box

            var codecontentss = $("#pre-id-0").clone().attr("id", "pre-id-"+count);
            var blogcontent = $("#p-id-0").clone().attr("id", "p-id-"+count).text('');
            codecontentss.find('#code-id-0').attr('id','code-id-'+count).text('');
            $("#preview").after(codecontentss);

            $("#preview").after(blogcontent);

            count++;

        }
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
         $(this).parent('div').remove(); x--;
         var id = $(this).attr('id');
         $("#p-id-"+id).remove();
         $("#pre-id-"+id).remove();
    });
 });
 $(document).on("keyup",".cont",function() { 
	    var id = $(this).attr('id');
	    var idcnt = get_numbers(id);
		$('#p-id-'+idcnt).text($(this).val());
	});

	$(document).on("keyup",".code",function() { 
      var id = $(this).attr('id');
      var idcode = get_numbers(id);
    $('#code-id-'+idcode).text($(this).val());
  });

$(document).on("change","#category",function() { 
        var category = $(this).val();
        $('#categoryinp').val($(this).val());
    });

 function get_numbers(input) {
    return input.match(/[0-9]+/g);
}

  function initGeolocation()
     {
        if( navigator.geolocation )
        {
           // Call getCurrentPosition with success and failure callbacks
           navigator.geolocation.getCurrentPosition( success, fail );
        }
        else
        {
           alert("Sorry, your browser does not support geolocation services.");
        }
     }

     function success(position)
     {

         document.getElementById('long').value = position.coords.longitude;
         document.getElementById('lat').value = position.coords.latitude
     }

     function fail()
     {
        // Could not obtain location
     }
