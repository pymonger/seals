<?php
  $serverConfig = 'local'; # 'local' 'dev' 'mt' 'jplstage' 'jpllive'
  $domain = null;
  print('<br/>POST domain? = ' . $_POST['domain']);
  if (isset($_POST['domain']))
  {
    $domain = $_POST['domain'];
    print('<br/>POST domain = ' . $domain);
    switch($_POST['domain'])
    {
      case 'localhost':
      case 'bergen.local':
        $serverConfig = 'local';
        break;
      case 'dev.mooreboeck.com':
        $serverConfig = 'dev';
        break;
      case 'www-stage.jpl.nasa.gov':
        $serverConfig = 'jplstage';
        break;
      case 'www.jpl.nasa.gov':
      case 'jpl.nasa.gov':
        $serverConfig = 'jpllive';
        break;
    }
  }
  switch($serverConfig) {
    case 'local':
      if ($domain == null) $domain = 'localhost';
      $main_server_path = "http://" . $domain . "/~bergen/jpl/infographics/";
      $saveDir = 'uploads/';
      break;
    case 'dev':
      if ($domain == null) $domain = 'dev.mooreboeck.com';
      $main_server_path = "http://" . $domain . "/~mooreboeck/mooreboeck.com/extranet/jpl/jplinfographics/dev/php/";
      $saveDir = 'uploads/';
      break;
    case 'jplstage':
      if ($domain == null) $domain = 'www-stage.jpl.nasa.gov';
      $main_server_path = "http://" . $domain . "/infographics/";
      $saveDir = '/home/www/infographics/uploads/';
      break;
    case 'jpllive':
    default:
      if ($domain == null) $domain = 'www.jpl.nasa.gov';
      $main_server_path = "http://" . $domain . "/infographics/";
      $saveDir = '/home/www/infographics/uploads/';
      break;
  }
?>