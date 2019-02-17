
<!-- resourceCategoryThumbnailGrid.php start -->

<script>
// User selects a new category in the pulldown, go there
function loadNewResourceCategory() 
{ 
	var selectedCategory = $('#resource_category_menu').val();
	//console.log("selectedCategory: ", selectedCategory); 
	gotoUrl("<?php echo($_SERVER['SCRIPT_NAME']); ?>?catId=" + selectedCategory); 
}
</script>


                <!-- Category Select -->
                <select id="resource_category_menu" class="category_menu" onChange="loadNewResourceCategory()">
                <option value="">All Resources</option>              
<?php

  	# Category select
  	require_once("Library/ResourceCategory.php");

  	$results = ResourceCategory::Find();

  	$categoryId = isset($_GET['catId']) ? $_GET['catId'] : null;
  	$categoryTitle = 'All Resources'; // Set in this conditional for use later in the page
  	if ($results) {
      	for ($i=0; $i<count($results); $i++)
      	{
        	$rcObj = ResourceCategory::CreateFromArray($results[$i]); 
        	print("\n<option value='" . $rcObj->id . "'");
        	if ($rcObj->id == $_GET['catId']) 
      		{
      			print(' SELECTED');
      			$categoryTitle = $rcObj->title;
      		}
        	print(">" . $rcObj->title . "</option>");
      	}
   	}

?>


                </select>


                <!-- Resource thumbs in current category -->
<?php
   	# Resource thumbs in current category
  	require_once("Library/Resource.php");

  	$results = Resource::FindByCategory($categoryId);

  	if ($results) {

 ?>
                <h2><?php echo($categoryTitle); ?></h2>
                <ul id="mini_thumbs">
<?php

      	for ($i=0; $i<count($results); $i++)
      	{
        	$rObj = Resource::CreateFromArray($results[$i]); 
         
        	if ($rObj->id != $resourceId) 
    		  {
      			$thisLink = $_SERVER['SCRIPT_NAME'] . "?id=" . $rObj->id . "&catId=" . $categoryId;
      			print("\n<li><a href=\"javascript:linkToImage('" . $thisLink . "')\">");
      			print("<img src='http://imagecache.jpl.nasa.gov/infographics/uploads/resources/thumbs/" . $rObj->filenameThumb . "' alt='" . $rObj->title . "' title='" . $rObj->title . "' /></a></li>");
      		}
        	else 
        	{
        	  print("\n<li class='active_thumb'><a href='javascript:void(0)'>");
      			print("<img src='http://imagecache.jpl.nasa.gov/infographics/uploads/resources/thumbs/" . $rObj->filenameThumb . "' alt='" . $rObj->title . "' title='" . $rObj->title . "' /></a></li>");
        		#print("\n<li class='active_thumb'><img src='uploads/resources/thumbs/" . $rObj->filenameThumb . "' alt='" . $rObj->title . "'  title='" . $rObj->title . "' /></li>");
        	}
      	}
?>
                

                </ul> <!-- ul#mini_thumbs -->
                
                <div id="mini_thumb_controller" class="unselectable">
                  <div class="arrow_btn_left" onclick="prevClick()"><div class="arrow"></div></div>
                  <ul id="page_num_nav">
                  	<li id='1'><a href="javascript:navMenuNumClick(1)">1</a></li>
                  </ul>
                  <div class="arrow_btn_right" onclick="nextClick()"><div class="arrow"></div></div>
                </div> <!-- #mini_thumb_controller -->
                <div class="clear" ></div>
                <div class="hr"><hr /></div>
                <div class="links_area">
			    <h3>Saving Resources</h3>
                <p>
                  Right-click (Ctrl-click on a Mac) on the "download this resource" link and select the option "Save Link As," "Save Target As" or the like.
                </p>
                <div class="hr"><hr></div>
               	<h3>More Resources</h3>
                  <ul>
                    <?php
                      if ($rcObj->link1) echo('<li><a target="_blank" href="' . $rcObj->url1 . '">' . $rcObj->link1 . '</a></li>');
                      if ($rcObj->link2) echo('<li><a target="_blank" href="' . $rcObj->url2 . '">' . $rcObj->link2 . '</a></li>');
                      if ($rcObj->link3) echo('<li><a target="_blank" href="' . $rcObj->url3 . '">' . $rcObj->link3 . '</a></li>');
                      if ($rcObj->link4) echo('<li><a target="_blank" href="' . $rcObj->url4 . '">' . $rcObj->link4 . '</a></li>');
                      if ($rcObj->link5) echo('<li><a target="_blank" href="' . $rcObj->url5 . '">' . $rcObj->link5 . '</a></li>');
                    ?>                  	
                  </ul>
                </div> <!-- .links_area -->
<?php
   	}
?>
                <div class="clear" ></div>
