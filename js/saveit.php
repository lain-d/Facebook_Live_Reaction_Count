<?php

if($_POST)
{
	$pid = $_POST["pageID"];
	$poid = $_POST["postID"];
	$sht = $_POST["includeShares"];

$myfile = fopen("../values.json", "w") or die("Unable to open file!");
$txt = '{
	"pageID": "'.$pid.'",
	"postID": "'.$poid.'",
	"includeShares": "'.$sht.'"
}';
fwrite($myfile, $txt);
fclose($myfile);
echo "1";
}




?>