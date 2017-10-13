<?php

require('../vendor/autoload.php');
$redis = new Predis\Client(getenv('REDIS_URL'));
if(isset($_POST['dataSets'])){
 $obj = json_decode($_POST['dataSets']);
foreach ($obj as $key => $value)
{
	$redis->set($key, $value);
}
        header('Content-Type: application/json');
        echo "{success}";
}
else
{
	    header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => 'ERROR', 'code' => 1337)));}
        echo "failed!";

?>

