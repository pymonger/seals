<?php
require_once('sessions.php'); # begin new session 
require_once('Library/User.php');

#
# BOUNCE UNAUTHORIZED USERS TO LOGIN or HOMEPAGE
#
if (isset($access_level))
{
  if (($access_level == 'user' || $access_level == 'username') && User::isLoggedIn() == false) 
  {
    header('location: user.signin.php?errormsg=• Please log in to view that page&redirectFrom=' . basename($_SERVER['PHP_SELF']) . '?' . urlencode($_SERVER['QUERY_STRING']));
    exit;
  }   
  elseif ($access_level == 'username' && User::isLoggedIn() == true && User::getUsername() == null)
  {
    header('location: account.php');
    exit;
  } 
  elseif ($access_level == 'admin' && User::isLoggedIn() == false) 
  {
    header('location: user.signin.php?errormsg=• Please log in as a site administrator to view that page&redirectFrom=' . basename($_SERVER['PHP_SELF']) . '?' . urlencode($_SERVER['QUERY_STRING']));
    exit;
  } 
  elseif ($access_level == 'admin' && User::isAdmin() == false) 
  {
    header('location: index.php');
    exit;
  }
  elseif ($access_level == 'guest' && User::isLoggedIn() == true)
  {
    # Login and register pages, for example
    header('location: index.php');
    exit;
  }
}

# BEGIN
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- includes/header.php start at line above -->

<html xmlns="http://www.w3.org/1999/xhtml">
<head>

	<!-- META and TITLE-->
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
    <meta name="keywords" content="Infographics, space images, space graphics, solar system, planets, stars, sun, Earth, Venus, Mercury, Mars, Jupiter, Saturn, Neptune, Uranus, Pluto, moon, asteroid, comet, universe, mission, spacecraft, design infographics, statistics, NASA, JPL, NASAJPL">
	<meta name="description" content="Create, upload and share your own space, solar system, planet and universe themed infographics on the NASA Jet Propulsion Laboratory website. We provide the data, graphics, images and research to get you started!">
	<meta name="author" content="JPL.NASA.GOV">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<?php
	if ($page_title) 
  {
    echo("<meta name=\"title\" content=\"Jet Propulsion Laboratory - " . $page_title . "\" />\n");
    echo("<title>Jet Propulsion Laboratory - " . $page_title . "</title>");
  }
	else 
  {
    echo("<meta name=\"title\" content=\"Jet Propulsion Laboratory - Infographics\" />\n");
    echo("<title>Jet Propulsion Laboratory - Infographics</title>");
  }
	?>

	<!-- CSS for JPL WRAPPER -->
	<link href="http://www.jpl.nasa.gov/css/main.css" rel="stylesheet" type="text/css" />

	<!-- CSS for INFOGRAPHICS -->
	<link href="css/infographics.css" rel="stylesheet" type="text/css" />
	<link href="css/top.css" rel="stylesheet" type="text/css" />
	<link href="css/jquery.rating.css" rel="stylesheet" type="text/css" />

	<?php foreach ($css_includes as $css_include) { echo('<link href="css/' . $css_include . '" rel="stylesheet" type="text/css" />'); } ?>

  <!-- Facebook share tags -->
  <meta property="og:site_name" content="JPL Infographics"/>
  <?php if (isset($fb_thumb)) echo("<meta property=\"og:image\" content=\"http://www.jpl.nasa.gov/infographics/" . $fb_thumb . "\">\n"); ?>
  <?php if (isset($fb_title)) echo("<meta property=\"og:title\" content=\"" . str_replace('"',"'",$fb_title) . "\">\n"); ?>
  <?php if (isset($fb_desc)) echo("<meta property=\"og:description\" content=\"" . str_replace('"',"'",$fb_desc) . "\">\n"); ?>
  <meta property="og:url" content="http://<?php echo($_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . '?'. $_SERVER['QUERY_STRING']); ?>" />
  
	<!-- CSS for JPL WRAPPER -->
	<!--[if IE]>
		<link rel="stylesheet" type="text/css" href="http://www.jpl.nasa.gov/css/IEwrapperfix.css" />
		<link rel="stylesheet" type="text/css" href="css/infographicsIEFixes.css" />
	<![endif]-->
	<!--[if IE 7]>
		<link rel="stylesheet" type="text/css" href="css/infographicsIE7.css" />
	<![endif]-->
	<!--[if IE 8]>
		<link rel="stylesheet" type="text/css" href="css/infographicsIE8.css" />
	<![endif]-->
	
	<!-- JAVASCRIPT for INFOGRAPHICS-->
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script type="text/javascript" src="scripts/jquery.placeholder.min.js"></script>
	<script type="text/javascript" src="scripts/infographics.js"></script>
	<script type="text/javascript" src="scripts/jquery.rating.pack.js"></script>
	<?php foreach ($js_includes as $js_include) { echo('<script type="text/javascript" src="scripts/' . $js_include . '"></script>'); } ?>

</head>

<body>
  <div id="wrapper_top">
  <?php include '../includes/header.php'; ?>
  </div><!-- #wrapper_top -->

  <div id="wrapper_middle_2"> <!-- Mission pnav -->
    <div id="middle_2_border">      
      <!--*Note: 	This page uses the following font format throughout the body using the external CSS stylesheet(included): 
          font-family: Helvetica, Arial, Verdana, sans-serif; color: #4b5c68;-->
      
      <div id="inner_body_content">
        <div id="main_content" align="center">
          

          <?php 
          	# Include the infographics top header/nav bar
          	require_once("top.php");

          	# Include the infographics admin top header/nav bar
          	require_once("admin_top.php"); 
          ?>

          <div class="clear" ></div>

<!-- includes/header.php end -->
     
