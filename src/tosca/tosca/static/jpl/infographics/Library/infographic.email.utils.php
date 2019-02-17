<?php
function sendApprovalEmailToUser($author, $status, $message)
{  
  print('<br/>Author: ' . $author);
  print('<br/>Status: ' . $status);
  print('<br/>message: ' . $message);
  print('<br/>');
  global $errors;

  //prepare email
  require_once('Library/User.php');
  $yourEmail = User::getEmail();
  $user = User::FindByUsername($author);
  if ($user)
  {
    $subject = "NASA Jet Propulsion Laboratory Infographic Status Update";  
    $message = '
      <html>
      <head>
        <title>NASA Jet Propulsion Laboratory Infographic Status Update</title>
      </head>
      <body>
        <table style="width:600px;" border="0">
          <tr>
          <td>
          <img src="http://www.jpl.nasa.gov/images/featurebanner.gif" alt="NASA JPL News" title="NASA JPL News" />
          <br /><br />
          Hi '. $user->firstName . ' ' . $user->lastName . ',
          
          This is a status update regarding the infographic you uploaded.

          The current status is ' . $status . '.

          Message from JPL: 
          ' . $message

          . '
          Thank you for submitting!
          <br />The JPL Web Team
          </td>
        </tr>
        </table>
      </body>
      </html>
    ';
    
    // To send HTML mail, the Content-type header must be set
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'From: NASA Jet Propulsion Laboratory <jplpublic@jpl.nasa.gov>' . "\r\n";
    $headers .= 'Reply-To: jplpublic@jpl.nasa.gov' . "\r\n";

    echo ("<hr>mail command is: mail($yourEmail,$subject,$message,$headers)<hr>");
    $mailSuccess = mail($yourEmail,$subject,$message,$headers);
    if ($mailSuccess == false);
    {
      # BERGEN put this back in when working on JPL machine
      $errors['Email to User'] = "Email failed";
    } 
  }
  else
  {
    $errors['Email to User'] = "Could not find user for email";   
  }

}



function sendUploadConfirmationEmailToUser($author)
{  
  print('<br/>Author: ' . $author);
  print('<br/>Status: ' . $status);
  print('<br/>message: ' . $message);
  print('<br/>');
  global $errors;

  //prepare email
  require_once('Library/User.php');
  $yourEmail = 'jon.d.nelson@jpl.nasa.gov';#User::getEmail();
  $user = User::FindByUsername($author);
  if ($user)
  {
    $subject = "NASA Jet Propulsion Laboratory Infographic Upload Confirmation";  
    $message = '
      <html>
      <head>
        <title>NASA Jet Propulsion Laboratory Infographic Upload Confirmation</title>
      </head>
      <body>
        <table style="width:600px;" border="0">
          <tr>
          <td>
          <img src="http://www.jpl.nasa.gov/images/featurebanner.gif" alt="NASA JPL News" title="NASA JPL News" />
          <br /><br />
          Hi '. $user->firstName . ' ' . $user->lastName . ',
          
          Thank you for uploading an infographic!

          Thank you for submitting!
          <br />The JPL Web Team
          </td>
        </tr>
        </table>
      </body>
      </html>
    ';
    
    // To send HTML mail, the Content-type header must be set
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'From: NASA Jet Propulsion Laboratory <jplpublic@jpl.nasa.gov>' . "\r\n";
    $headers .= 'Reply-To: jplpublic@jpl.nasa.gov' . "\r\n";

    echo ("<hr>mail command is: mail($yourEmail,$subject,$message,$headers)<hr>");
    $mailSuccess = mail($yourEmail,$subject,$message,$headers);
    if ($mailSuccess == false);
    {
      $errors['Email to User'] = "Email failed";
    } 
  }
  else
  {
    $errors['Email to User'] = "Could not find user for email";   
  }

}

?>