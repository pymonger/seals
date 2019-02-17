// JavaScript Document

$(window).load(function() {
	
	// If the image is wide, change the orientation
	var img = document.getElementById('detail_img');
	var $mainArea = $("div#body_middle");
	var $imgArea = $('#detail_img_area');
  var isWideFormat = img.width > img.height && img.width > 640;
  var isWideFormatButNotFullWidth = img.width < 922;
  
  if (isWideFormat) {
		$mainArea.addClass("full_width");
		// Add padding if the image doesn't fill the area
		if (isWideFormatButNotFullWidth) $imgArea.css('padding', '20px 0');
	} else {
		// Add padding if the image doesn't fill the area
		if (img.width < 621) $imgArea.css('padding', '20px 0');
	}
	
	$('div#detail_img_area').css("visibility", "visible");
	
	// Would like to do this, but IE doesn't return width and height when using display:none
	//$('div#detail_img_area').hide().fadeIn(500); 
	
	// Light box function
	$(function() { $('a.lightbox').lightBox(); });
	
	/* --- INTERACTIVE RATINGS --- */

  // This has to be on load to prevent radio buttons from showing
  var interactiveRatingsExist = $('div.star_ratings_interactive').length > 0;
  console.log('interactiveRatingsExist: ' + interactiveRatingsExist);
  if (interactiveRatingsExist) initInteractiveRatings();
  
});




/* --- FUNCTIONS --- */

// handle detail view star ratings
function initInteractiveRatings () 
{
  console.log("initInteractiveRatings()");
  
  $('div.rating-cancel').css('display', 'none');
  $('div.star_ratings_interactive').css('visibility', 'visible');
  
	$('.auto-submit-star').rating({
	  
		callback: function (value, link){
		  
		  var infographicId = getParameterByName('id');
		  var selectedRating = value;
		  
		  var urlStringToSubmit = "infographic.rate.php?id=" + infographicId + "&rating=" + selectedRating;
		  console.log(urlStringToSubmit);
		  
		  //xmlhttp.open("GET",urlStringToSubmit,true);
      //xmlhttp.send();
      
      $.get(urlStringToSubmit, function(result){
        console.log(result);
      });
	  }
	  
	});
}

