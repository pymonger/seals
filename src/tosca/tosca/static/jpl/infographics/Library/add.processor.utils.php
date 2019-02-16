<?php
# COMMON
error_reporting(0);
$errors = array();

# COMMON
function validateRequiredField ($fieldName)
{
	global $errors;
	if (isset($_POST[$fieldName]) && $_POST[$fieldName] == "") 
	{
		$errors[$fieldName] = ucwords($fieldName) . " is required";
	}
}

# COMMON
function validateFileType ($file, $allowedTypes)
{
	$allowedFileTypes = array();
	switch ($allowedTypes) 
	{
		case 'all':
			array_push($allowedFileTypes, 'application/pdf');
			array_push($allowedFileTypes, 'application/zip');
			array_push($allowedFileTypes, 'application/x-compressed');
			array_push($allowedFileTypes, 'application/x-zip-compressed');
			array_push($allowedFileTypes, 'application/x-gzip-compressed');
			array_push($allowedFileTypes, 'application/x-rar-compressed');
			array_push($allowedFileTypes, 'application/octet-stream');
			array_push($allowedFileTypes, 'text/plain');
			array_push($allowedFileTypes, 'text/richtext');
			array_push($allowedFileTypes, 'application/msword');
			array_push($allowedFileTypes, 'application/vnd.ms-excel');
			array_push($allowedFileTypes, 'application/vnd.ms-powerpoint');
			array_push($allowedFileTypes, 'image/tif');
			array_push($allowedFileTypes, 'image/x-tif');
			array_push($allowedFileTypes, 'image/tiff');
			array_push($allowedFileTypes, 'image/x-tiff');
			array_push($allowedFileTypes, 'application/tif');
			array_push($allowedFileTypes, 'application/x-tif');
			array_push($allowedFileTypes, 'application/tiff');
			array_push($allowedFileTypes, 'application/x-tiff');
			array_push($allowedFileTypes, 'application/x-rar-compressed');
			# not breaking on purpose, 'all' includes images
		case 'image':
			array_push($allowedFileTypes, 'image/gif');
			array_push($allowedFileTypes, 'image/jpeg');
			array_push($allowedFileTypes, 'image/x-citrix-jpeg');
			array_push($allowedFileTypes, 'image/pjpeg');
			array_push($allowedFileTypes, 'image/png');
			array_push($allowedFileTypes, 'image/x-png');
			array_push($allowedFileTypes, 'image/x-citrix-png');
			break;
	}
	foreach ($allowedFileTypes as $allowed) {
  		if (strpos(strtolower($file['type']), $allowed) >= 0) return true;
	}
	return false;
}

function validateFileExtension ($file, $allowedTypes)
{
	$allowedFileExtensions = array();
	switch ($allowedTypes) 
	{
		case 'all':
			return true;
			break;
		case 'image':
			array_push($allowedFileExtensions, '.gif');
			array_push($allowedFileExtensions, '.jpeg');
			array_push($allowedFileExtensions, '.jpg');
			array_push($allowedFileExtensions, '.png');
			break;
	}
	foreach ($allowedFileExtensions as $allowed) {
		if (strpos(strtolower(pathinfo($file['tmp_name'], PATHINFO_EXTENSION)), $allowed) == 0) return true;
	}
	return false;
}

# COMMON
function validateFileSize ($fileSize, $maxFileSize)
{
	echo("<br/>".$fileSize['size'] . "/" . $maxFileSize);
	return (int)$fileSize['size'] <= $maxFileSize;
}

# COMMON? Needs file types set
function saveUploadedFile($file, $saveDir, $filename, $isViewable = true, $isDownloadable = true, $allowedTypes = 'all', $maxFileSize = 5000000, $compressDownloadableImages = true)
{
	global $errors;

	if (validateFileType($file, $allowedTypes))
	{
		if (validateFileExtension($file, $allowedTypes))
		{
			if (validateFileSize($file, $maxFileSize))
			{
				if ($file["error"] > 0)
				{
					// Error
					$errors['file'] = "File upload failed with error code: " . $file["error"];
					return false;
		    }
		  	else
		    {

	  			# Determine paths
					$inpath = $file["tmp_name"];
					echo("<br/>inpath=".$inpath);
					$convertCmdPath = "/usr/local/bin/convert";
					echo("<br/>convertCmdPath=".$convertCmdPath);

	  			# Determine filetype
	  			if (strncmp(mime_content_type($inpath),"image/",6)===0) 
	  			{
					  $type=substr(mime_content_type($inpath),6). ":";
					  $isImage = true;
					  $sizeArray = getimagesize($inpath);
					  $orientation = $sizeArray[0] >= $sizeArray[1] ? 'horizontal' : 'vertical';
					  echo("<br/>size=".$sizeArray[3]);
					  echo("<br/>orientation=".$orientation);
				  } else {
				    $type=mime_content_type($inpath);
				    $isImage = false;
				  }
				  echo("<br/>filetype=".$type);
				  echo("<br/>isImage=".($isImage==true?'true':'false'));


	    		#
					# Save Original for download/enlargement
					#
	    		if ($isDownloadable == true) 
	    		{
						echo("<hr/>FULL SIZE");

		    		$outpath = $saveDir . "full/" . $filename;
						echo("<br/>outpath=".$outpath);
						echo("<br/>compressDLImages? " . $compressDownloadableImages);

						echo("<br/><strong>Full size image saving without conversion...</strong><br/>");
						$serverFeedback = copy($inpath, $outpath);
						echo("<br/>feedback=".$serverFeedback." ....");
					  if ($serverFeedback === false)
				  	{
							$errors['file'] = "File upload failed: " . $filename;
							echo("<br/>" . $errors['file']);
							unlink($file["tmp_name"]);
							if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
							if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
							return false;
				  	}
				  	else 	
				  	{
				  		echo("<br/><strong>Full size image saving...</strong><br/>");
				  	}
				  }

	    		#
	    		# Save Compressed Versions for display
					#
					if ($isViewable == true) 
					{
					  echo("<hr/>DETAIL");

	    			$outpath = $saveDir . $filename;

					  echo("<br/>outpath=".$outpath);

						#
						# Save Detail
						#
						if ($isImage)
						{
						  echo("<br/><strong>Detail size image saving...</strong><br/>");

						  if ($orientation == 'horizontal') 
						  	$maxWidth = 941;
							else 
								$maxWidth = 640;

							# Run the ImageMagick command to compress it
							$exec = $convertCmdPath . " -verbose " . $inpath . " -resize " . $maxWidth . "\> " . $outpath . " 2>&1";
							$serverFeedback = exec($exec);
							echo("<br/>$ " . $exec);
							echo("<br/>feedback=".$serverFeedback." ....");
						  $newSizeArray = null;
						  $newSizeArray = getimagesize($outpath);
						} else {
							#throw new Exception ('Attempting to save a non-image file as an image');

							$errors['thumbfile'] = "Attempting to save a non-image file as a thumbnail: " . $filename;
							echo("<br/>" . $errors['thumbfile']);
							unlink($file["tmp_name"]);
							if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
							if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
							return false;
						}

						# Give feedback
						if ($newSizeArray == null) 
						{
							$errors['file'] = "File upload failed: " . $filename;
							echo("<br/>" . $errors['file']);
							unlink($file["tmp_name"]);
							if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
							if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
							return false;
						} 
						else 
						{
							echo("<br/><strong>Detail size image uploaded as ".$newSizeArray[3]."</strong><br/>");
						}
					

						#
						# Save Thumb
						#					
					  echo("<hr/>THUMB");

	    			$outpath = $saveDir . "thumbs/" . $filename;
					  echo("<br/>outpath=".$outpath);

						if ($isImage)
						{
						  echo("<br/><strong>Thumbnail size image saving...</strong><br/>");
					  	$maxWidth = 206;
							$maxHeight = 120;
							$quality = 82;

							# Run the ImageMagick command to compress it
							$exec = $convertCmdPath . " -verbose " . $inpath . " -resize " . $maxWidth . "x" . $maxHeight . "^ -quality " . $quality . " " . $outpath . " 2>&1";

						  /*
						  # If not working on old version Imagemagick at jpl
							if ($orientation == 'horizontal') 
						  {
						  	# Size down to width, then up to height if necessary
								$exec = $convertCmdPath . " -verbose " . $inpath . " -resize " . $maxWidth . "\> " . $outpath . " 2>&1";
								$exec2 = $convertCmdPath . " -verbose " . $outpath . " -resize x" . $maxHeight . "< " . $outpath . " 2>&1";
							}
							else
							{
								#Size down to height, then up to width if necessary
								$exec = $convertCmdPath . " -verbose " . $inpath . " -resize x" . $maxHeight . "\> " . $outpath . " 2>&1";
								$exec2 = $convertCmdPath . " -verbose " . $inpath . " -resize " . $maxWidth . "< " . $outpath . " 2>&1";
							}*/

							$serverFeedback = exec($exec);
							#$serverFeedback2 = exec($exec2);
							echo("<br/>$ " . $exec);
							#echo("<br/>$ " . $exec2);
							echo("<br/>feedback1=".$serverFeedback." ....");
							#echo("<br/>feedback2=".$serverFeedback2." ....");
						  $newSizeArray = null;
						  $newSizeArray = getimagesize($outpath);
						} else {
							unlink($file["tmp_name"]);
							if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
							if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
							throw new Exception ('Attempting to save a non-image file as an image');
						}

						# Give feedback
						if ($newSizeArray == null) 
						{
							$errors['file'] = "File upload failed: " . $filename;
							echo("<br/>" . $errors['file']);
							unlink($file["tmp_name"]);
							if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
							if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
							return false;
						} 
						else 
						{
							echo("<br/><strong>Thumb size image uploaded as ".$newSizeArray[3]."</strong><br/>");
						}
					}
					unlink($file["tmp_name"]);
					if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
					if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
					return true;
		    }
			}
			else
			{
				// File too large
				$errors['file'] = "File upload failed: Invalid file size (" . (int)((int)$file["size"]/1000000) . "mb). Must be under " . $maxFileSize/1000000 . "mb.";
				echo("<br/>" . $errors['file']);
				unlink($file["tmp_name"]);
				if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
				if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
				return false;
			}
		}
		else
		{
			// File is wrong Extension
			$errors['file'] = "File upload failed: Invalid file extension (" . $file["type"] . ").";
			echo("<br/>" . $errors['file']);
			unlink($file["tmp_name"]);
			if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
			if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
			return false;
		}
	}
	else
	{
		// File is wrong type
		$errors['file'] = "File upload failed: Invalid file type (" . $file["type"] . ").";
		echo("<br/>" . $errors['file']);
		unlink($file["tmp_name"]);
		if(is_file("full/" . $file["tmp_name"]) == true) unlink("full/" . $file["tmp_name"]);
		if(is_file("thumb/" . $file["tmp_name"]) == true) unlink("thumb/" . $file["tmp_name"]);
		return false;
	}
}
?>