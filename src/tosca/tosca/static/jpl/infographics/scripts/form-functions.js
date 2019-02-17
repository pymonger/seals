// JavaScript Document

/*
 * These functions are called by forms when a submit button is clicked. 
 * It submits after it runs all the necessary front-end checks to make sure a form is ready.
*/

/* --------- MODS FOR IE (handled in infographics.js)------------- */
// console.log() fix and support for .indexOf() in IE
//if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };
//if(!Array.indexOf){ Array.prototype.indexOf = function(obj){for(var i=0; i<this.length; i++){ if(this[i]==obj){return i;}} return -1;}}




/* --------- VARIABLES ------------- */

// To check for input changes (for IE)
var titleChanged = false;
var descriptionChanged = false;

// Arrays of required fields by page
var adminEditInfographic_fields = [ 'title', 'description', 'category' ];
var adminUploadResources_fields = [ 'imageFile', 'title', 'description', 'category' ];
var adminEditResource_fields = [ 'title', 'description', 'category' ];
var editFeature_fields = [ 'imageFile', 'tagline', 'link', 'title', 'description' ];
var register_fields = [ 'firstName', 'lastName', 'username', 'email', 'password', 'verifyPassword', 'securityAnswer' ];
var signIn_fields = [ 'email', 'password' ];
var uploadInfographic_fields = [ 'imageFile', 'title', 'description', 'category' ];
var resetPassword1_fields = [ 'firstName', 'lastName','email', 'securityAnswer' ];
var resetPassword2_fields = [ 'password', 'verifyPassword' ];

// Error message for missing image file selection
var browseEntryErrorMsg = "Please select one of the required file formats";

// Array of categories selected from dropdown menu
var selectedCategories = new Array();

// Spinner (for info see http://fgnass.github.com/spin.js/)
var opts = {
  width: 6, // The line thickness
	length: 1,
  color: '#d63b25', // #rgb or #rrggbb
  className: 'spinner', // The CSS class to assign to the spinner
  top: -6 // Top position relative to parent in px
};
var opts2 = {
  width: 6, // The line thickness
	length: 1,
  color: '#d63b25', // #rgb or #rrggbb
  className: 'spinner2', // The CSS class to assign to the spinner
  top: -6 // Top position relative to parent in px
};
var optsGreen = {
  width: 6, // The line thickness
	length: 1,
  color: '#2E7C7D', // #rgb or #rrggbb
  className: 'spinner', // The CSS class to assign to the spinner
  top: -6 // Top position relative to parent in px
};







/* --------- ON UNLOAD ------------- */
// If a user comes to the page without it refreshing (like "back")
// We need to make sure we are showing the upload button and
// removing the spinner (if it exists)
$(window).unload(function() {
	$('.submit_btns').children().css('visibility', 'visible');
	if ($('div.spinner')) $('div.spinner').css('display', 'none');
	if ($('div.spinner2')) $('div.spinner2').css('display', 'none');
});







/* --------- ON READY ------------- */

$(function() {
	
	// Create listeners if necessary
	var browseBtnsExist = $('div.file_upload_container').length > 0;
	console.log("browseButtonsExist: " + browseBtnsExist);
	
	if (browseBtnsExist) initListeners();

	var serverErrorMessage = getParameterByName('errormsg');
	if (serverErrorMessage)
	{
		serverErrorMessage = serverErrorMessage.replace(/passcode/g,"password"); // we can't use "password" in query strings, so allowing "passcode" and swapping it to "password" on display
		$('#error_message_main').css('display','block').html("<strong>Notice:</strong> <br />");
		$('#error_message_main').append(serverErrorMessage + '<br />');
	}

	// This gets called from the php for forms that need populated categories
	if (window.prepopulateSelectedCategories)
	{
		prepopulateSelectedCategories();
	}
	
	
});



/* --------- FUNCTIONS ------------- */

function initListeners ()
{
	var greenBrowseBtnsExist = $('div.file_upload_container div.control_btn_green').length > 0;
	
	console.log("fileUploadMouseoverListeners.greenBrowseBtnsExist: " + greenBrowseBtnsExist);
	
	$('div.file_upload_container').mouseover(function() {
		if (greenBrowseBtnsExist)
			$('div.file_upload_container div.control_btn_green').addClass('control_btn_green_over');		
	});
	
	$('div.file_upload_container').mouseout(function() {
		if (greenBrowseBtnsExist)
			$('div.file_upload_container div.control_btn_green').removeClass('control_btn_green_over');
	});
	
	/* Because IE doesn't support placeholders in textarea, we are also checking for a change */
	$('textarea.title_input').change(function() { titleChanged = true; });
	$('textarea.desc_input').change(function() { descriptionChanged = true; });
}

function onFileSelected ( src )
{
	console.log("fileSelected.$(src).attr('id') " + $(src).attr('id'));
	
	// Store the id of this input file upload button
	var thisID = $(src).attr('id'); // (i.e. fileUpload or fileUpload2)
	
	// Store file path
	var filePath = $(src).val();
	var fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);

	// Check if there's more than one browse area and if both are visible
	var twoBrowseAreasExist = $('#browse_area_1').length > 0;
	var twoBrowseAreasVisible = twoBrowseAreasExist && $('#browse_area_1').css('display') == 'block';
	var nonImageFileSelected = !isImage(fileName);
	var isOnlyBrowseEntry = !twoBrowseAreasExist;
	var isFirstBrowseEntry = thisID == "fileUpload";
	var isSecondBrowseEntry = thisID == "fileUpload2"; 
	
	// First browse
	if (isFirstBrowseEntry) {
		if (nonImageFileSelected && isOnlyBrowseEntry)
			$('#browse_area_0 .filename').text(browseEntryErrorMsg).css('display', 'block');
		else 
			$('#browse_area_0 .filename').text(fileName).css('display', 'block');
		
		if (nonImageFileSelected && twoBrowseAreasExist) { 
		  if (isResourceFileType(fileName)) {
			  $('#browse_area_1').css('display', 'block');
		  } else {
		    $('#browse_area_0 .filename').text(browseEntryErrorMsg).css('display', 'block');
		    $('#browse_area_1').css('display', 'none'); 
		  }
		} else {
			$('#browse_area_1').css('display', 'none');
		}
	} 
	// Second browse (if exists)
	else if (isSecondBrowseEntry) { 
		if (nonImageFileSelected)
			$('#browse_area_1 .filename').text(browseEntryErrorMsg).css('display', 'block');
		else 
			$('#browse_area_1 .filename').text(fileName).css('display', 'block');
	}
}

function onCategoryMenuChange ( forcedSelection )
{
  var selectedCategory;
  
  if (typeof(forcedSelection)==='undefined') selectedCategory = $('.category_menu option:selected').text(); 
  else selectedCategory = forcedSelection;
  
	// Store the value (name) of the selected category
	// var selectedCategory = $('.category_menu option:selected').text();
	
	console.log("selectedCategory: ", selectedCategory);
	
	// Store whether it has already been selected
	var notPreviouslySelected = jQuery.inArray(selectedCategory, selectedCategories) == -1;
	
	// If the selected category is not the default prompt & it hasn't been selected,
	// add it to the list of selected categories...
	if (selectedCategory != "default" && notPreviouslySelected) {
		
		// Define a full category entry to display
		var categoryEntry = '<li id="' + selectedCategory + '"><p>'+selectedCategory+'</p><a class="delete_btn">delete</a><div class="clear"></div><div class="hr"><hr /><input type="hidden" name="categories[]" value="'+selectedCategory+'"></div></li>';
		
		// Add the entry to the list
		$('ul.category_list').append(categoryEntry);
		
		// Add the category to the array of added categories
		selectedCategories.push(selectedCategory);
		
		// Check if we're already clearing the bottom to ensure the bottom margin
		// If not, then add the clear
		var clearDoesNotExist = $('div.clear_category_menu').length == 0;
		if (clearDoesNotExist)
			$('ul.category_list').parent().parent().append('<div class="clear clear_category_menu"></div>');
		
		//  Set the listener for "delete" button
		$("a.delete_btn").click(function() {
			
			console.log("$(this).parent('p:first').html(): " + $(this).parent('p:first').text());
			console.log("$(this).parent('p').attr('id'): " + $(this).parent().attr('id'));
			
			// Store the id of the entry that this delete button belongs to
			var categoryToRemove = $(this).parent().attr('id');
			
			<!-- UPDATE -->
			// Remove the category entry from the category menu
			$(this).parent().remove();

			// Remove the category from the array so it can be added to the list again if requested
			selectedCategories = jQuery.grep(selectedCategories, function(value) {
				return value != categoryToRemove;
			});
			
		});
		
	}
	
	// Always set the dropdown back to the default prompt
	$('.category_menu').val("default");
	
}

function onSubmit ( pageType )
{
	console.log("onUploadClick.pageType: "+ pageType);
	
	if (formsComplete(pageType)) {
		console.log("onUploadClick forms are complete: "+ pageType);

		// Hide the submit buttons
		$('.submit_btns').children().css('visibility', 'hidden');
		
		// Show the spinner
		var spinnerTarget = document.getElementById('submit_btn').parentNode;
		var spinner;  
		if (pageType == 'uploadInfographic') spinner = new Spinner(optsGreen).spin(spinnerTarget);
		else spinner = new Spinner(opts).spin(spinnerTarget);
		
		
		// Show a second spinner if there is a top submit button (for a long page)
		var submit_btn2Exists = $('#submit_btn2').length > 0;
		console.log("onSubmit.submit_btn2Exists: " + submit_btn2Exists);
		if (submit_btn2Exists) {
				var spinnerTarget2 = document.getElementById('submit_btn2').parentNode;
				var spinner2 = new Spinner(opts2).spin(spinnerTarget2);
		}
		
		// Clear the error messages
		$('#error_message_main').css('display','none').html("");
		
		// Upload the file
		$('.basic_form').submit();
		//return false;
	}  
}






/* --------- UTILS ------------- */

function formsComplete ( pageType ) 
{
	// Checks for all required elements
	// Gives error message for each element
	// Returns whether all forms are complete
	
	console.log('formsComplete.pageType: ' + pageType);
	
	var imageFileAdded, titleAdded, descriptionAdded, categoriesAdded, fNameAdded, lNameAdded, uNameAdded, emailAdded, pwAdded, vpwAdded, sQuestionAdded, sAnswerAdded;
		
	var thisFormArray = eval(pageType + "_fields");
	console.log('thisFormArray: ' + thisFormArray);

	var requiresImageFile = $.inArray('imageFile', thisFormArray) > -1;
	var requiresTagline = $.inArray('tagline', thisFormArray) > -1;
	var requiresLink = $.inArray('link', thisFormArray) > -1;
	var requiresTitle = $.inArray('title', thisFormArray) > -1;
	var requiresDescription = $.inArray('description', thisFormArray) > -1;
	var requiresCategory = $.inArray('category', thisFormArray) > -1;
	var requiresFName = $.inArray('firstName', thisFormArray) > -1;
	var requiresLName = $.inArray('lastName', thisFormArray) > -1;
	var requiresUName = $.inArray('username', thisFormArray) > -1;
	var requiresEmail = $.inArray('email', thisFormArray) > -1;
	var requiresPW = $.inArray('password', thisFormArray) > -1;
	var requiresVPW = $.inArray('verifyPassword', thisFormArray) > -1;
	var requiresSAnswer = $.inArray('securityAnswer', thisFormArray) > -1;
	
	var allFormsComplete = true; // We will check against this below
		
	if (requiresImageFile) {
		var imageIsSelected = isImage($('#browse_area_0 .filename').text());
		var imageIsSelected2 = false; // *** FOR ADMIN RESOURCE UPLOAD ***
		if ('#browse_area_1 .filename') imageIsSelected2 = isImage($('#browse_area_1 .filename').text());
		var imageFileAdded = imageIsSelected || imageIsSelected2;
		if (!imageFileAdded) allFormsComplete = false; 
		//console.log('requiresImageFile');
	}
	
	if (requiresTagline) {
		var taglineAdded = $('textarea.tagline_input').val().length > 0;
		if (!taglineAdded) allFormsComplete = false; 
		//console.log('requiresTagline');
	}
	if (requiresLink) {
		var linkAdded = $('textarea.link_input').val().length > 0;
		if (!linkAdded) allFormsComplete = false; 
		//console.log('requiresLink');
	}
	if (requiresTitle) {
	  var val = $('textarea.title_input').val();
	  var requiresNewText = pageType == 'uploadInfographic' || pageType == 'adminUploadResources';
		var titleAdded = val.length > 0;
		// This is needed for IE because it counts the placeholder text as a value
		if (requiresNewText && !titleChanged && val == "enter title") titleAdded = false;
		if (!titleAdded) allFormsComplete = false; 
		console.log('val: ' + val);
		console.log('titleChanged: ' + titleChanged);
		console.log('pageType: ' + pageType);
		console.log('titleAdded: ' + titleAdded);
		console.log(pageType == 'uploadInfographic');
		console.log(titleChanged && pageType == 'uploadInfographic');
		console.log('requiresTitle');
	}
	if (requiresDescription) {
	  var val = $('textarea.desc_input').val();
	  var requiresNewText = pageType == 'uploadInfographic' || pageType == 'adminUploadResources';
		var descriptionAdded = val.length > 0;
		// This is needed for IE because it counts the placeholder text as a value
		if (requiresNewText && !descriptionChanged && val == "enter description") descriptionAdded = false;
		if (!descriptionAdded) allFormsComplete = false; 
		console.log('requiresDescription');
	}
	if (requiresCategory) {
		var categoriesAdded = selectedCategories.length > 0;
		if (!categoriesAdded) allFormsComplete = false; 
		console.log('requiresCategory');
	}
	if (requiresFName) {
		var fNameAdded = $('input.first_name_input').val().length > 0;
		if (!fNameAdded) allFormsComplete = false; 
		console.log('requiresFName');
	}
	if (requiresLName) {
		var lNameAdded = $('input.last_name_input').val().length > 0;
		if (!lNameAdded) allFormsComplete = false; 
		console.log('requiresLName');
	}
	if (requiresUName) {
		var uNameAdded = $('input.username_input').val().length > 0;
		if (!uNameAdded) allFormsComplete = false; 
		console.log('requiresUName');
	}
	if (requiresEmail) {
		var entry = $('input.email_input').val();
		var atpos=entry.indexOf("@");
		var dotpos=entry.lastIndexOf(".");
		var notValidAddress = atpos<1 || dotpos<atpos+2 || dotpos+2>=entry.length;
		var emailAdded = !notValidAddress;
		if (!emailAdded) allFormsComplete = false; 
		console.log('requiresEmail');
	}
	if (requiresPW) {
		var pwAdded = $('input.password_input').val().length > 4;
		if (!pwAdded) allFormsComplete = false; 
		console.log('requiresPW');
	}
	if (requiresVPW) {
		var entry = $('input.verify_password_input').val();
		var matchesPW = entry == $('input.password_input').val(); 
		var vpwAdded = matchesPW;
		if (!vpwAdded) allFormsComplete = false; 
		console.log('requiresVPW');
	}
	if (requiresSAnswer) {
		var sAnswerAdded = $('input.security_answer_input').val().length > 0;
		if (!sAnswerAdded) allFormsComplete = false; 
		console.log('requiresSAnswer');
	}
	
	if (!allFormsComplete) {
		console.log('All Forms are NOT Complete');

		$('#error_message_main').css('display','block').html("<strong>Please complete the following:</strong> <br />");
		if (requiresImageFile && !imageFileAdded) $('#error_message_main').append('• Choose file <br />');
		if (requiresTagline && !taglineAdded) $('#error_message_main').append('• Tagline <br />');
		if (requiresLink && !linkAdded) $('#error_message_main').append('• Link URL <br />');
		if (requiresTitle && !titleAdded) $('#error_message_main').append('• Title <br />');
		if (requiresDescription && !descriptionAdded) $('#error_message_main').append('• Description <br />');
		if (requiresCategory && !categoriesAdded) $('#error_message_main').append('• Category <br />');
		if (requiresFName && !fNameAdded) $('#error_message_main').append('• Full name <br />');
		if (requiresLName && !lNameAdded) $('#error_message_main').append('• Last name <br />');
		if (requiresUName && !uNameAdded) $('#error_message_main').append('• Username <br />');
		if (requiresEmail && !emailAdded) $('#error_message_main').append('• Valid email address <br />');
		if (requiresPW && !pwAdded) $('#error_message_main').append('• Password (at least 5 characters) <br />');
		if (requiresVPW && !vpwAdded) $('#error_message_main').append('• Verify matching password <br />');
		if (requiresSAnswer && !sAnswerAdded) $('#error_message_main').append('• Security answer <br />');
		return false;
	} else {
		return true;
	}
	
}

/* ------- UTILS -------- */
function isImage ( string )
{    
  var s = string; 
  var isGif = _contains(s,'.gif'); 
  var isJpg = _contains(s,'.jpg') || _contains(s,'.jpeg');   
  var isPng = _contains(s,'.png');         
	var isImage = (isGif || isJpg || isPng);   
	return isImage;
} 

function isResourceFileType ( string )
{  
  var s = string;
  var isPdf = _contains(s,'.pdf');  
  var isZip = _contains(s,'.zip'); 
  var isTif = _contains(s,'.tif') || _contains(s,'.tiff');   
  var isTxt = _contains(s,'.txt');  
  var isDoc = _contains(s,'.doc') || _contains(s,'.docx'); 
  var isPpt = _contains(s,'.ppt') || _contains(s,'.pptx');
  var isRar = _contains(s,'.rar');  
	var isResourceFileType = (isPdf || isZip || isTif || isTxt || isDoc || isPpt || isRar);     
	return isResourceFileType
} 

function _contains ( str1 , str2 )
{ 
  var str1ContainsStr2 = str1.toLowerCase().indexOf(str2) > -1;  
  return str1ContainsStr2;
}

function allowEnterKeyToSubmit( pageType )
{
	document.onkeydown = function(e)
	{
	  var keyCode = document.all ? event.keyCode : e.which;
	  if(keyCode == 13) onSubmit(pageType); 
	}       
}



