  
          <!-- includes/top.php start -->

          <div id="body_top1">
  
            <a href="index.php"><img id="body_logo" src="images/logo.png" alt="JPL Infographics Logo"/></a>
            
            <div id="search_area">
              <form method="get" id="searchform" action="infographic.results.php">
                <fieldset class="search">
                  <input type="text" name="q" class="box corners_search" value="<?php if(isset($_GET['q'])) echo(htmlentities($_GET['q'])); ?>" placeholder="search infographics" />
                  <button class="btn" title="Submit Search">GO</button>
                </fieldset>
              </form>
            </div> <!-- #search_area" -->
            
            <div class="clear" ></div>
            
          </div> <!-- #body_top1 -->
          
          <div id="body_top2" class="body_top2_shadow">
            
            <ul id="body_top_account_nav">
            <?php 

              # Set up login/logout/register links with redirects back to where we came from
              $redirectUponLogin = '';
              if (!isset($noPostLoginRedirect) || $noPostLoginRedirect == false)
              {
                $redirectUponLogin = "?redirectFrom=" . basename($_SERVER['PHP_SELF']) . '?' . urlencode($_SERVER['QUERY_STRING']);
              }
              if (User::isLoggedIn())
              {
              ?>

              <li>signed in as <?php echo(User::getUsernameOrEmail()); ?></li>
              <li>•</li>
              <li><a href="account.php">my account</a></li>
              <li>•</li>
              <?php if(isset($_SESSION['fbLogOutURL'])){ ?>
                <li><a href="<?php echo $_SESSION['fbLogOutURL']; ?>">logout</a></li>
              <?php }else{ ?>
                <li><a href="user.logout.php<?php echo($redirectUponLogin); ?>">logout</a></li>
              <?php }; ?>
            <?php
              } 
              else
              {
            ?>
              <li>not signed in</li>
              <li>•</li>
              <li><a href="user.signin.php<?php echo($redirectUponLogin); ?>">login</a></li>
              <li>•</li>
              <li><a href="user.signup.php<?php echo($redirectUponLogin); ?>">sign up</a></li>
            <?php
              }
            ?>
            </ul>
            
            <ul id="body_top_main_nav">
              <li id="create"><a <?php if($area=='create') echo('class="active"'); ?> href="create.html" title="Create">Create</a></li>
              <li id="upload"><a <?php if($area=='upload') echo('class="active"'); ?> href="infographic.add.php" title="Upload">Upload</a></li>
              <li id="explore"><a <?php if($area=='explore') echo('class="active"'); ?> href="infographic.list.php" title="Explore">Explore</a></li>
            </ul>
            
            <ul class="share_nav">
              <li class="facebook"><a href="javascript:facebookShare();" title="Facebook" >Facebook</a></li>
              <li class="twitter"><a href="javascript:twitterShare();" title="Twitter" >Twitter</a></li>              
              <li class="google"><a href="javascript:googleShare();" title="Google" >Google</a></li>
              <li class="email"><a href="javascript:emailShare();" title="Email" >Email</a></li>
            </ul>
            
            <p id="body_top_share_text">share this page:</p>
            
          </div> <!-- #body_top2 -->
          
          <div class="clear" ></div>
          
          <!-- includes/top.php end -->
          