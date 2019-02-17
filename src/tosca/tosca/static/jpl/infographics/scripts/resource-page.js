// JavaScript Document

// This checks the size of the main image and 
// if it's less than 640 wide it adds padding 
// and shows at it's actual size.

// Otherwise the image is shown at 640px wide.
  
   


/* ------- INIT VARIABLES --------- */ 
 
var totalThumbs = 0;
var currentThumbMenu = 1;
var thumbsPerPage = 15;
var totalThumbSets = 1;
var navMenuCount = 1; 
var firstVisibleThumb = 0;
var lastVisibleThumb = thumbsPerPage;

// Spinner (for info see http://fgnass.github.com/spin.js/)
var opts = {
  width: 6, // The line thickness
	length: 1,
  color: '#d63b25', // #rgb or #rrggbb
  className: 'spinner', // The CSS class to assign to the spinner
  top: 100 // Top position relative to parent in px
};
   
/* ------- end INIT VARIABLES --------- */ 
      



/* ------- ON READY --------- */ 
   
$(function() {
   
  initVariables();
  initLoadingAnimations();
  initMainImage();  
  initThumbs(); 
  
})

/* ------- end ON READY  --------- */ 

     


/* ------- INIT FUNCTIONS--------- */ 

function initVariables ()
{
  // Set the current thumb menu based on the page parameter passed in the url
  // else it defaults to 1
  if (getParameterByName("page")) currentThumbMenu = getParameterByName("page");
  
  totalThumbs = $('ul#mini_thumbs li').length;
  totalThumbSets = Math.ceil(totalThumbs/thumbsPerPage);
  
  // Set the values for the current set of visible thumbs
  setVisibleThumbVars();  
}  

function initLoadingAnimations ()
{
  // Show loading animations
  var spinnerTargetMain = document.getElementById('body_middle_left'); 
  var spinnerTargetThumbs = document.getElementById('mini_thumbs');  
  var spinnerMain = new Spinner(opts).spin(spinnerTargetMain);
  var spinnerThumbs = new Spinner(opts).spin(spinnerTargetThumbs);
}
 
function initMainImage ()
{
  // Show the main image after it's loaded
  $('img#detail_img').imagesLoaded( function(){
    //console.log("main image is loaded");  
    
    // Hide the spinner
    if ($('#body_middle_left div.spinner')) $('#body_middle_left div.spinner').css('display', 'none');  
    
    // Show the main image
    showMainImage();
  });
}

function initThumbs ()
{           
  var imgsLoaded = 0; 
  
  $('ul#mini_thumbs li img').each(function(index) { 
               
    $(this).imagesLoaded( function(){
      //console.log("initThumbs().totalThumbSets, imgsLoaded: " + totalThumbSets + ', ' + imgsLoaded); 
      //console.log('imgsLoaded % thumbsPerPage: ' + imgsLoaded % thumbsPerPage)
      
      var enoughThumbsLoaded = totalThumbSets == 1 || (totalThumbSets > 1 && imgsLoaded == thumbsPerPage);
      var anotherThumbNavNeeded = imgsLoaded > 0 && imgsLoaded % thumbsPerPage === 0; 
      
      setThumbSize(this);
      displayThumb(this, index);
      imgsLoaded ++;  
            
      if (enoughThumbsLoaded) {
        // Hide the spinner
        if ($('#mini_thumbs div.spinner')) $('#mini_thumbs div.spinner').css('display', 'none');
      } 
       
      if ( anotherThumbNavNeeded ) {
        //console.log( "DISPLAY A NEW NUMBER BUTTON");
        addThumbNavNum(); 
      }
    }); 
    
  });
  
  $('ul#mini_thumbs').imagesLoaded( function(){
       initThumbMenu();
  }); 
  
} 

function initThumbMenu ()
{
  // Activate the current number button  
  //console.log ('initThumbMenu().currentThumbMenu: '+ currentThumbMenu);
  $('ul#page_num_nav li#' + currentThumbMenu).addClass('active');  
}

/* ------- end INIT FUNCTIONS --------- */
                  




/* ------- FUNCTIONS --------- */ 

function addThumbNavNum ()
{   
  //console.log ('addThumbNavNum');
  
  var nextNum = navMenuCount + 1;
  
  // If this is the first additional number button, show the thumb nav bar
  // and activate the current number button  
  if (navMenuCount == 1) {
    $('#mini_thumb_controller').css('display', 'block');    
    //console.log("THUMB NAV BAR IS DISPLAYED");
  }
  
   // Add the next number button
  $('ul#page_num_nav li#' + navMenuCount).after('<li id="' + nextNum + '"><a href="javascript:navMenuNumClick(' + nextNum + ')">' + nextNum + '</a></li>'); 
   
  navMenuCount ++;
   
  // Activate the current number button  
  //console.log ('addThumbNavNum().navMenuCount, currentThumbMenu: ' + navMenuCount + ', ' + currentThumbMenu);
 // if (navMenuCount == currentThumbMenu)
    //$('ul#page_num_nav li#' + currentThumbMenu).addClass('active');
} 

function showMainImage ()
{
  // If the main image is wide, change the orientation
	var img = document.getElementById('detail_img');
	var imgIsSmallerThan640 = img.width < 640;
	var $mainArea = $("div#body_middle");
	var $imgArea = $('#detail_img_area');

	if (imgIsSmallerThan640) {
		$imgArea.css('padding', '20px 0');
	} else {
	  $('img#detail_img').css('width', '640px');
	}
  
  // Show the image
	$('div#detail_img_area').css('visibility', 'visible'); 
	
	// Show the description
	$('.resources_middle #description_area').css('visibility', 'visible');   

	// Would like to do this, but IE doesn't return width and height when using display:none
	//$('div#detail_img_area').hide().fadeIn(500);

}

function setThumbSize ( target )
{
  // Set the correct size for the thumb
    
  var imgW = $(target).width();
  var imgH = $(target).height();
  
  //console.log('initThumbSize.imgW, imgH: ' + imgW + ', ' + imgH);

  if (imgW <= imgH) $(target).css('width', '84px');
  else $(target).css('height', '84px'); 
                                        
  //console.log('initThumbSize.$(target).width(), $(target).height(): ' + $(target).width() + ', ' + $(target).height()); 
} 

function displayThumb ( target , targetIndex )
{    
  var targetListItem =  $(target).parent().parent(); 
  //var targetIndex = $('ul#mini_thumbs li').index(targetListItem);
  var isHiddenThumb = targetIndex < firstVisibleThumb || targetIndex > lastVisibleThumb - 1; 
  
  //console.log('displayThumb().targetIndex: ' + targetIndex); 
  
  //targetListItem.css('visibility', 'visible');
  
  if (isHiddenThumb) {
    $(targetListItem).addClass('hidden'); 
    //console.log('displayThumb(). thumbnail image ' + targetIndex + ' is now hidden');  
  } else { 
    if ($(targetListItem).hasClass('hidden')) $(targetListItem).removeClass('hidden');
    targetListItem.css('visibility', 'visible');
    //console.log('displayThumb(). thumbnail image ' + targetIndex + ' is now displayed');
  }
} 

function showCurrentThumbs ()
{   
  setVisibleThumbVars();
  
  $('ul#mini_thumbs li img').each(function(index) {
    displayThumb(this, index); 
  });
  
} 

function setVisibleThumbVars () 
{
  firstVisibleThumb = (currentThumbMenu - 1) * thumbsPerPage;
  lastVisibleThumb = (currentThumbMenu) * thumbsPerPage;
}

function navMenuNumClick ( thisID )
{
  //console.log('navMenuNumClick(' + thisID + ')');
  
  $('ul#page_num_nav li#' + currentThumbMenu).removeClass('active');
  currentThumbMenu = thisID;
  $('ul#page_num_nav li#' + currentThumbMenu).addClass('active');
  
  showCurrentThumbs();
}

function prevClick ( thisID )
{
  $('ul#page_num_nav li#' + currentThumbMenu).removeClass('active');
  
  if (currentThumbMenu > 1) currentThumbMenu = currentThumbMenu - 1;
  else currentThumbMenu = totalThumbSets;

  $('ul#page_num_nav li#' + currentThumbMenu).addClass('active');
  
  showCurrentThumbs();
}

function nextClick ( thisID )
{  
  //console.log('nextClick.currentThumbMenu: ' + currentThumbMenu);
  //console.log('nextClick.totalThumbSets: ' + totalThumbSets);
  
  $('ul#page_num_nav li#' + currentThumbMenu).removeClass('active');
  
  if (currentThumbMenu < totalThumbSets) currentThumbMenu++;
  else currentThumbMenu = 1;

  $('ul#page_num_nav li#' + currentThumbMenu).addClass('active');
  
  showCurrentThumbs();
}   
  
/* ------- end METHODS --------- */ 



/* ------- UTILS --------- */ 

function appendPageParameter ()
{
  var url = window.location.href;
  if (url.indexOf('?') > -1){
     url += '&page=' + currentThumbMenu;
  }else{
     url += '?param=1'
  }
}

function linkToImage ( linkUrl ) 
{
  window.location.href = linkUrl + "&page=" + currentThumbMenu;
} 

/* ------- end UTILS --------- */


