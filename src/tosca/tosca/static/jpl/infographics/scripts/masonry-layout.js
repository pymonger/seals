// This handles the variable size grid layout on Category pages, search results, etc. 

$(function() {
	
	var $container = $('#thumb_grid_masonry');
	
	$container.imagesLoaded(function(){
	  console.log("imagesLoaded");
		$container.masonry({
			itemSelector : '.thumb_entry',
			columnWidth : 239
		});
		$container.css('visibility', 'visible');
		console.log($container.css('visibility'));
	});
	
	$container.infinitescroll({	  
		navSelector  : '#page-nav',    // selector for the paged navigation 
		nextSelector : '#page-nav a',  // selector for the NEXT link (to page 2)
		itemSelector : '.thumb_entry',     // selector for all items you'll retrieve
		extraScrollPx: 120,
		loading: {
			finishedMsg: '',
			msgText: ''
		}
	},
		function(newElements){
      var $newElems = $( newElements ).css({ opacity: 0 });
      // ensure that images load before adding to masonry layout
			$newElems.imagesLoaded(function(){
			  $('.star', this).rating(); // this activates the new ratings
			  $('.star_ratings_interactive, .star_ratings').css('visibility', 'visible');
				// show elems now they're ready
				$newElems.animate({ opacity: 1 });
				$container.masonry( 'appended', $newElems, true ); 
			});
    });
});


