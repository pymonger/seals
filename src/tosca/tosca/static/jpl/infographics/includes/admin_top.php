<?php
require_once('Library/User.php');
if(User::isAdmin()) {

?>

          <!-- includes/admin_top.php start if logged in as admin -->
          
          <div id="admin_top">
          	<h5>ADMIN</h5>
            <ul id="admin_nav">
            	<li <?php if ($adminArea == 'infographics') echo('class="active"'); ?>><a href="infographic.list.admin.php">INFOGRAPHICS</a></li>
              <li>|</li>
              <li <?php if ($adminArea == 'resources') echo('class="active"'); ?>><a href="resource.list.admin.php">RESOURCES</a></li>
              <li>|</li>
              <li <?php if ($adminArea == 'featured image') echo('class="active"'); ?>><a href="home.edit.php">FEATURED IMAGE</a></li>
            </ul>            
          </div> <!-- #admin_top -->
          
          <div class="clear" ></div>
          
          <!-- includes/admin_top.php end -->
<?php 
} 
?>