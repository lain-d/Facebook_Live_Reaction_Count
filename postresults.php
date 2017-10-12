<?php
require('vendor/autoload.php');
$redis = new Predis\Client(getenv('REDIS_URL'));
if(isset($_POST['data'])){
 $obj = json_decode($_POST['data']);
foreach ($obj as $key => $value)
{
	$redis->set($key, $value);
	echo $key." ".$value;
}
}
?>