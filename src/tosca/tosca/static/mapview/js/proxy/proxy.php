<?php
	$url = htmlspecialchars_decode($_GET['img']);
	$ch = curl_init($url);
    //$fp = fopen("example_homepage.txt", "w");

    //curl_setopt($ch, CURLOPT_FILE, $fp);
    header("Access-Control-Allow-Origin: *");
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);

    echo curl_exec($ch);
    curl_close($ch);
?>